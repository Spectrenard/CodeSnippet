import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "@/app/context/ThemeContext";

const categories = [
  // Web Frontend
  {
    group: "Frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Angular",
      "Vue",
      "Svelte",
      "NextJS",
    ],
  },

  // Backend
  {
    group: "Backend",
    items: [
      "NodeJS",
      "Python",
      "Java",
      "PHP",
      "Ruby",
      "Go",
      "Rust",
      "Express",
      "NestJS",
      "Django",
      "Laravel",
    ],
  },

  // Mobile & Desktop
  {
    group: "Mobile & Desktop",
    items: ["Swift", "Kotlin", "Flutter", "ReactNative", "C", "C++", "C#"],
  },

  // Base de données & Autres
  {
    group: "Autres",
    items: ["SQL", "MongoDB", "PostgreSQL", "Redis", "JSON", "Regex"],
  },
];

const CategorySelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode } = useTheme();
  const dropdownRef = useRef(null);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrer les catégories en fonction de la recherche
  const filteredCategories = categories
    .map((group) => ({
      group: group.group,
      items: group.items.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          darkMode
            ? "bg-zinc-800 text-gray-200 outline-none border-none focus:ring-1 focus:ring-zinc-700"
            : "bg-white text-gray-800 outline-none ring-0"
        } p-2 rounded border cursor-pointer outline-none flex justify-between items-center`}
      >
        <span>{value || "Select a category"}</span>
        <span className="ml-2">▼</span>
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-1 rounded-md shadow-lg ${
            darkMode
              ? "bg-zinc-800 border-zinc-700"
              : "bg-white border-gray-300"
          } border`}
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 rounded border outline-none f ${
                darkMode
                  ? "bg-zinc-700 text-gray-200 border-zinc-600 focus:ring-1 focus:ring-zinc-700"
                  : "bg-gray-50 border-gray-300 focus:ring-1 focus:ring-gray-400"
              }`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.map((group) => (
              <div key={group.group}>
                <div
                  className={`px-3 py-1 font-semibold ${
                    darkMode ? "bg-zinc-700 text-gray-300" : "bg-gray-100"
                  }`}
                >
                  {group.group}
                </div>
                {group.items.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      onChange(item);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`px-4 py-2 cursor-pointer ${
                      darkMode
                        ? "hover:bg-zinc-700 text-gray-200"
                        : "hover:bg-gray-100"
                    } ${
                      value === item
                        ? darkMode
                          ? "bg-zinc-600"
                          : "bg-blue-50"
                        : ""
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SnippetForm = ({ setSnippets, setMessage, closeModal, initialData }) => {
  const { darkMode } = useTheme();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [category, setCategory] = useState(initialData?.category || "");
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);

  const handleSubmit = async () => {
    if (title && description) {
      try {
        const method = initialData ? "PUT" : "POST";
        const url = initialData
          ? `${process.env.NEXT_PUBLIC_API_URL}/snippets/${initialData.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/snippets`;

        const snippetData = {
          title,
          description,
          category,
          isPublic: isPublic,
        };

        console.log("Données envoyées:", snippetData);

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(snippetData),
        });

        if (response.ok) {
          const updatedSnippet = await response.json();
          console.log("Snippet created/updated:", updatedSnippet);

          if (initialData) {
            setSnippets((prevSnippets) =>
              prevSnippets.map((snippet) =>
                snippet.id === initialData.id ? updatedSnippet : snippet
              )
            );
            toast.success("Snippet updated successfully !", {
              style: { backgroundColor: "#BB86FC", color: "white" },
            });
          } else {
            setSnippets((prevSnippets) => [...prevSnippets, updatedSnippet]);
            toast.success("Snippet added successfully !", {
              style: { backgroundColor: "#81C784", color: "white" },
            });
          }
          closeModal();
        } else {
          setMessage("Error submitting snippet.");
          toast.error("Error submitting snippet.", {
            style: { backgroundColor: "#F44336", color: "white" },
          });
        }
      } catch (error) {
        console.error("Erreur :", error);
        setMessage("An error occurred while submitting the snippet.");
        toast.error("An error occurred while submitting the snippet.", {
          style: { backgroundColor: "#F44336", color: "white" },
        });
      }
    } else {
      setMessage("Please fill all fields.");
      toast.error("Please fill all fields.", {
        style: { backgroundColor: "#FFEB3B", color: "black" },
      });
    }
  };

  const getLanguage = () => {
    switch (category) {
      case "JavaScript":
      case "TypeScript":
      case "NodeJS":
      case "NestJS":
        return "javascript";
      case "React":
        return "jsx";
      case "Python":
        return "python";
      case "Swift":
        return "swift";
      case "Java":
      case "C":
        return "java";
      default:
        return "javascript";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`${
            darkMode ? "text-gray-300" : "text-gray-800"
          } font-bold text-xl`}
        >
          {initialData ? "Modifier un Snippet" : "Ajouter un Snippet"}
        </h2>
        <button
          onClick={closeModal}
          style={{ zIndex: 10 }}
          className={`${
            darkMode ? "text-gray-300 bg-zinc-900" : "text-gray-800"
          } absolute top-4 right-4 text-xl`}
        >
          &times;
        </button>
      </div>

      <label
        htmlFor="title"
        className={`${
          darkMode ? "text-gray-300" : "text-gray-800"
        } text-md font-semibold`}
      >
        Title
      </label>
      <input
        id="title"
        type="text"
        placeholder="(ex: for loop)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`${
          darkMode
            ? "bg-zinc-800 border-zinc-700 text-gray-300 w-full p-2 rounded mb-4 outline-none focus:ring-1 focus:ring-black/20"
            : "w-full p-2 border border-gray-300 rounded mb-4 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black/20"
        }`}
      />

      <div className="mb-4">
        <label
          className={`block ${
            darkMode ? "text-gray-200" : "text-gray-700"
          } text-sm font-bold mb-2`}
        >
          Category
        </label>
        <CategorySelect value={category} onChange={setCategory} />
      </div>

      <label
        htmlFor="description"
        className={`${
          darkMode ? "text-gray-300" : "text-gray-800"
        } text-md font-semibold`}
      >
        Code
      </label>

      {/* Monaco Editor */}
      <MonacoEditor
        height="200px"
        language={getLanguage()}
        theme={"vs-dark"}
        value={description}
        onChange={(value) => setDescription(value)}
        options={{
          selectOnLineNumbers: true,
          wordWrap: "on",
          minimap: { enabled: false },
        }}
        className="w-full py-4 rounded-full"
      />

      <div className="flex items-center gap-2 my-4">
        <label
          htmlFor="isPublic"
          className={`${
            darkMode ? "text-gray-300" : "text-gray-800"
          } text-md font-semibold flex items-center cursor-pointer`}
        >
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => {
              console.log("Changement isPublic:", e.target.checked);
              setIsPublic(e.target.checked);
            }}
            className={`${
              darkMode ? "text-gray-400" : "text-gray-800"
            } w-4 h-4 rounded focus:ring-black mr-2`}
          />
          {isPublic ? "Remove from community" : "Share with the community"}
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className={`${
          darkMode
            ? "bg-zinc-800 border-zinc-700 text-gray-300 w-full p-2 rounded mb-4 outline-none focus:ring-1 focus:ring-black/20"
            : "w-full p-2 border border-gray-300 rounded mb-4 bg-zinc-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black/20"
        }`}
      >
        {initialData ? "Update Snippet" : "Add Snippet"}
      </button>
    </div>
  );
};

export default SnippetForm;
