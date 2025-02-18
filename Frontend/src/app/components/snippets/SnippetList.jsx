import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoCopyOutline, IoCheckmark, IoPencil } from "react-icons/io5"; // Ajout de IoPencil
import DeleteSnippetButton from "./DeleteSnippetButton";
import { useTheme } from "@/app/context/ThemeContext";
import SnipetSyntaxModal from "./SnipetSyntaxModal";
import { categoryStyles } from "../../../utils/categoryStyles";

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
                } rounded-lg shadow-md p-6 transition-transform flex flex-col hover:scale-[1.01] min-h-[300px]`}
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
