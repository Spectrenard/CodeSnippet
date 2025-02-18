"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import SearchBar from "../components/ui/SearchBar";
import SnippetCard from "../components/hub/SnippetCard";
import LoadingHub from "../components/ui/Loading/LoadingHub";
import { useTheme } from "../context/ThemeContext";
import { categoryStyles } from "../../utils/categoryStyles";

const BookmarksPage = () => {
  const { darkMode } = useTheme();
  const [bookmarkedSnippets, setBookmarkedSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);

  const sortOptions = [
    { value: "recent", label: "Most recent" },
    { value: "popular", label: "Most popular" },
    { value: "oldest", label: "Oldest" },
  ];

  const fetchBookmarkedSnippets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hub/bookmarks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookmarkedSnippets(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedSnippets();
  }, []);

  useEffect(() => {
    if (!bookmarkedSnippets) return;

    let filtered = [...bookmarkedSnippets];

    if (searchTerm) {
      filtered = filtered.filter((snippet) =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Appliquer le tri
    filtered = sortSnippets(filtered);

    setFilteredSnippets(filtered);
  }, [searchTerm, bookmarkedSnippets, sortBy]);

  const sortSnippets = (snippets) => {
    if (!snippets) return [];

    switch (sortBy) {
      case "recent":
        return [...snippets].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "popular":
        return [...snippets].sort((a, b) => b.likesCount - a.likesCount);
      case "oldest":
        return [...snippets].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return snippets;
    }
  };

  const handleLike = (snippetId, isLiked, likesCount) => {
    setBookmarkedSnippets((prevSnippets) =>
      prevSnippets.map((snippet) =>
        snippet.id === snippetId ? { ...snippet, isLiked, likesCount } : snippet
      )
    );
  };

  const handleBookmark = (snippetId, isBookmarked) => {
    if (!isBookmarked) {
      // Si le snippet n'est plus bookmarké, le retirer de la liste
      setBookmarkedSnippets((prevSnippets) =>
        prevSnippets.filter((snippet) => snippet.id !== snippetId)
      );
    }
  };

  const handleCopy = async (code, snippetId) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSnippetId(snippetId);
      setTimeout(() => {
        setCopiedSnippetId(null);
      }, 2000); // Réinitialise après 2 secondes
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-zinc-900" : "bg-gray-100"
      } min-h-screen flex flex-col`}
    >
      <header className="bg-gray-50">
        <Navbar />
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1
            className={`${
              darkMode ? "text-gray-200" : "text-gray-800"
            } text-2xl font-bold`}
          >
            My Saved Snippets
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div
                className={`${
                  darkMode ? "bg-zinc-800" : "bg-white"
                } p-4 rounded-lg shadow`}
              >
                <SearchBar setSearchTerm={setSearchTerm} />
              </div>
            </div>

            <div className="sm:w-48">
              <div
                className={`${
                  darkMode ? "bg-zinc-800" : "bg-white"
                } p-4 rounded-lg shadow`}
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`${
                    darkMode
                      ? "bg-zinc-800 text-gray-200 border-zinc-700 text-gray-400"
                      : "bg-white"
                  } w-full p-2 border border-gray-300 rounded-md focus:outline-none`}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, index) => (
                <LoadingHub key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredSnippets && filteredSnippets.length > 0 ? (
                filteredSnippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    categoryStyles={categoryStyles}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onCopy={handleCopy}
                    copiedSnippetId={copiedSnippetId}
                  />
                ))
              ) : (
                <div
                  className={`${
                    darkMode ? "bg-zinc-800" : "bg-white"
                  } text-center py-12 rounded-lg shadow`}
                >
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-lg`}
                  >
                    No snippet found
                  </p>
                  <p
                    className={`${
                      darkMode ? "text-gray-500" : "text-gray-600"
                    } mt-2`}
                  >
                    Explore the hub to find interesting snippets
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookmarksPage;
