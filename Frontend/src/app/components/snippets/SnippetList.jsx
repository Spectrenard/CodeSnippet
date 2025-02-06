import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoCopyOutline, IoCheckmark, IoPencil } from "react-icons/io5"; // Ajout de IoPencil
import DeleteSnippetButton from "./DeleteSnippetButton";
import { useTheme } from "@/app/context/ThemeContext";
import SnipetSyntaxModal from "./SnipetSyntaxModal";

// Styles pour les catégories
const categoryStyles = {
  // Web Frontend
  JavaScript: "bg-yellow-200 text-yellow-800",
  TypeScript: "bg-blue-300 text-blue-900",

  // Frontend Frameworks
  React: "bg-cyan-200 text-cyan-800",
  Angular: "bg-red-200 text-red-800",
  Vue: "bg-green-200 text-green-800",
  Svelte: "bg-orange-300 text-orange-900",
  NextJS: "bg-gray-800 text-gray-200",

  // Backend
  NodeJS: "bg-green-300 text-green-900",
  Python: "bg-blue-200 text-blue-800",
  Java: "bg-red-300 text-red-900",
  PHP: "bg-indigo-300 text-indigo-900",
  Ruby: "bg-red-400 text-red-950",
  Go: "bg-sky-200 text-sky-800",
  Rust: "bg-orange-400 text-orange-950",

  // Backend Frameworks
  Express: "bg-gray-300 text-gray-800",
  NestJS: "bg-red-200 text-red-800",
  Django: "bg-green-400 text-green-950",
  Laravel: "bg-pink-400 text-pink-950",
  Spring: "bg-green-200 text-green-800",

  // Mobile
  Swift: "bg-orange-200 text-orange-800",
  Kotlin: "bg-purple-300 text-purple-900",
  Flutter: "bg-blue-400 text-blue-950",
  ReactNative: "bg-blue-200 text-blue-800",

  // Base de données
  SQL: "bg-blue-300 text-blue-900",
  MongoDB: "bg-green-200 text-green-800",
  PostgreSQL: "bg-blue-400 text-blue-950",
  Redis: "bg-red-200 text-red-800",

  // Autres
  C: "bg-blue-200 text-blue-800",
  "C++": "bg-pink-200 text-pink-800",
  "C#": "bg-purple-200 text-purple-800",
  JSON: "bg-yellow-300 text-yellow-900",
  Regex: "bg-gray-400 text-gray-900",
};

const SnippetList = ({ snippets, onEdit, onDelete }) => {
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);
  const { darkMode } = useTheme();

  // Ajout de logs pour déboguer
  useEffect(() => {
    console.log("Snippets reçus:", snippets);
    snippets.forEach((snippet) => {
      console.log(`Snippet ${snippet.id}:`, {
        title: snippet.title,
        isPublic: snippet.isPublic,
        typeOf: typeof snippet.isPublic,
        rawValue: JSON.stringify(snippet.isPublic),
      });
    });
  }, [snippets]);

  // Fonction utilitaire pour vérifier isPublic
  const isSnippetPublic = (snippet) => {
    return Boolean(snippet.isPublic);
  };

  const handleCopy = (text, snippetId) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Texte copié dans le presse-papiers");
        setCopiedSnippetId(snippetId); // Met à jour l'état pour indiquer que ce snippet a été copié
        setTimeout(() => setCopiedSnippetId(null), 2000); // Réinitialise après 2 secondes
      })
      .catch((err) => {
        console.error("Erreur lors de la copie du texte : ", err);
      });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.length === 0 ? (
        <div className="flex items-center justify-center h-[50vh] col-span-1 md:col-span-2 lg:col-span-3">
          <p
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } text-center text-lg`}
          >
            No snippet found
          </p>
        </div>
      ) : (
        [...snippets]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Trie les snippets
          .map((snippet) => {
            console.log(
              `Rendu du snippet ${snippet.id}, isPublic:`,
              snippet.isPublic
            );
            return (
              <div
                key={snippet.id}
                className={`${
                  darkMode ? "bg-zinc-800" : "bg-white"
                } rounded-lg shadow-md p-6 transition-transform flex flex-col hover:scale-[1.01]`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className={`${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    } font-semibold text-lg`}
                  >
                    {snippet.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {isSnippetPublic(snippet) && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Public
                      </span>
                    )}
                    {snippet.category && (
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          categoryStyles[snippet.category]
                        }`}
                      >
                        {snippet.category}
                      </span>
                    )}
                  </div>
                </div>
                <SnipetSyntaxModal
                  copiedSnippetId={copiedSnippetId}
                  handleCopy={handleCopy}
                  snippet={snippet}
                >
                  {snippet.description}
                </SnipetSyntaxModal>
                <div className="flex gap-2 mt-4 ">
                  <button
                    onClick={() => handleCopy(snippet.description, snippet.id)}
                    className={`w-full ${
                      darkMode
                        ? "bg-zinc-700 text-gray-300 border-zinc-600 hover:bg-zinc-600"
                        : "bg-white border-gray-200 border"
                    } font-semibold text-black py-2 px-4 rounded transition hover:scale-[1.01] hover:bg-gray-50 focus:outline-none flex items-center justify-center`}
                  >
                    {copiedSnippetId === snippet.id ? (
                      <>
                        Copied ! <IoCheckmark className="ml-2" />
                      </>
                    ) : (
                      <>
                        Copy <IoCopyOutline className="ml-2" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(snippet)}
                    className={`${
                      darkMode
                        ? "bg-zinc-700 text-gray-300 border-zinc-600 hover:bg-zinc-600"
                        : "bg-white border-gray-200 border"
                    } font-semibold text-black py-2 px-4 rounded transition hover:scale-[1.01] hover:bg-gray-50 focus:outline-none flex items-center justify-center`}
                  >
                    <IoPencil className="text-lg" />
                  </button>
                  <DeleteSnippetButton
                    snippetId={snippet.id}
                    onDelete={onDelete}
                  />
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default SnippetList;
