import { useTheme } from "@/app/context/ThemeContext";
import React from "react";
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";

const CopySnippet = ({ snippet, handleCopy, copiedSnippetId }) => {
  const { darkMode } = useTheme();

  return (
    <button
      onClick={() => handleCopy(snippet.description, snippet.id)}
      className={`${
        darkMode
          ? "text-gray-400 border-gray-600 bg-zinc-800"
          : "text-gray-800 bg-white"
      } flex items-center space-x-2 transition px-4 py-2 rounded-full border border-gray-200 hover:border-indigo-500`}
    >
      {copiedSnippetId === snippet.id ? (
        <>
          <IoCheckmark className="text-xl text-green-600" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <IoCopyOutline className="text-xl" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default CopySnippet;
