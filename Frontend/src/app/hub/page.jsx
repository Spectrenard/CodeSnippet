"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import SearchBar from "../components/ui/SearchBar";
import CategoryFilter from "../components/ui/CategoryFilter";
import SnippetCard from "../components/hub/SnippetCard";
import LoadingHub from "../components/ui/Loading/LoadingHub";
import TrendingSidebar from "../components/hub/TrendingSidebar";
import { useTheme } from "../context/ThemeContext";
const HubPage = () => {
  const categoryStyles = {
    JavaScript: "bg-yellow-200 text-yellow-800",
    Typescript: "bg-blue-300 text-blue-900",
    React: "bg-purple-200 text-purple-800",
    Angular: "bg-red-200 text-red-800",
    Vue: "bg-green-200 text-green-800",
    Python: "bg-blue-200 text-blue-800",
    NodeJS: "bg-green-300 text-green-900",
    Swift: "bg-orange-200 text-orange-800",
    Java: "bg-red-200 text-red-800",
    NestJS: "bg-indigo-200 text-indigo-800",
    C: "bg-gray-300 text-gray-900",
  };

  const [publicSnippets, setPublicSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const sortOptions = [
    { value: "recent", label: "Most recent" },
    { value: "popular", label: "Most popular" },
    { value: "oldest", label: "Oldest" },
  ];

  const fetchPublicSnippets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hub/public`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const snippets = await response.json();
        console.log("Données reçues:", snippets);
        setPublicSnippets(snippets);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchPublicSnippets();
  }, []);

  useEffect(() => {
    if (!Array.isArray(publicSnippets)) return;

    let filtered = [...publicSnippets];

    if (searchTerm) {
      filtered = filtered.filter((snippet) =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (snippet) => snippet.category === selectedCategory
      );
    }

    filtered = sortSnippets(filtered);
    setFilteredSnippets(filtered);
  }, [searchTerm, selectedCategory, publicSnippets, sortBy]);

  const handleCopy = (text, snippetId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSnippetId(snippetId);
      setTimeout(() => setCopiedSnippetId(null), 2000);
    });
  };

  const handleLike = (snippetId, isLiked, likesCount) => {
    setPublicSnippets((prevSnippets) =>
      prevSnippets.map((snippet) =>
        snippet.id === snippetId ? { ...snippet, isLiked, likesCount } : snippet
      )
    );
  };

  const handleBookmark = (snippetId, isBookmarked) => {
    setPublicSnippets((prevSnippets) =>
      prevSnippets.map((snippet) =>
        snippet.id === snippetId ? { ...snippet, isBookmarked } : snippet
      )
    );
  };

  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-zinc-900" : "bg-gray-100"
      } flex flex-col`}
    >
      <header className="bg-gray-50">
        <Navbar />
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 space-y-6">
            <div
              className={`${
                darkMode ? "bg-zinc-800" : "bg-white"
              } p-4 rounded-lg shadow`}
            >
              <h2
                className={`font-bold text-lg ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                } mb-4`}
              >
                Categories
              </h2>
              <CategoryFilter onSelectCategory={setSelectedCategory} />
            </div>

            <div
              className={`${
                darkMode ? "bg-zinc-800" : "bg-white"
              } p-4 rounded-lg shadow`}
            >
              <h2
                className={`font-bold text-lg ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                } mb-4`}
              >
                Sort by
              </h2>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      sortBy === option.value
                        ? "bg-zinc-900 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-zinc-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-3xl">
            <div
              className={`${
                darkMode ? "bg-zinc-800" : "bg-white"
              } p-4 rounded-lg shadow mb-6`}
            >
              <SearchBar setSearchTerm={setSearchTerm} />
            </div>

            <div className="lg:hidden p-4 rounded-lg shadow sticky top-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`${
                  darkMode ? "bg-zinc-100" : "bg-white"
                } w-full p-2 border border-gray-300 rounded-md`}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                      copiedSnippetId={copiedSnippetId}
                      onCopy={handleCopy}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No snippet found</p>
                )}
              </div>
            )}
          </div>

          <div className="hidden xl:block w-72">
            <TrendingSidebar categoryStyles={categoryStyles} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HubPage;
