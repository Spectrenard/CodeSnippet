import React, { useState } from "react";
import { toast } from "react-toastify";
import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "@/app/context/ThemeContext";
const categories = [
  "JavaScript",
  "Typescript",
  "React",
  "Angular",
  "Vue",
  "Python",
  "NodeJS",
  "NestJS",
  "Swift",
  "Java",
  "C",
]; // Liste des catégories

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
        console.log("État isPublic avant envoi:", isPublic);

        const method = initialData ? "PUT" : "POST";
        const url = initialData
          ? `http://localhost:3000/snippets/${initialData.id}`
          : "http://localhost:3000/snippets";

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
          console.log("Snippet créé/modifié:", updatedSnippet);

          if (initialData) {
            setSnippets((prevSnippets) =>
              prevSnippets.map((snippet) =>
                snippet.id === initialData.id ? updatedSnippet : snippet
              )
            );
            toast.success("Snippet modifié avec succès !", {
              style: { backgroundColor: "#BB86FC", color: "white" },
            });
          } else {
            setSnippets((prevSnippets) => [...prevSnippets, updatedSnippet]);
            toast.success("Snippet ajouté avec succès !", {
              style: { backgroundColor: "#81C784", color: "white" },
            });
          }
          closeModal();
        } else {
          setMessage("Erreur lors de la soumission du snippet.");
          toast.error("Erreur lors de la soumission du snippet.", {
            style: { backgroundColor: "#F44336", color: "white" },
          });
        }
      } catch (error) {
        console.error("Erreur :", error);
        setMessage(
          "Une erreur s'est produite lors de la soumission du snippet."
        );
        toast.error(
          "Une erreur s'est produite lors de la soumission du snippet.",
          {
            style: { backgroundColor: "#F44336", color: "white" },
          }
        );
      }
    } else {
      setMessage("Veuillez remplir tous les champs.");
      toast.error("Veuillez remplir tous les champs.", {
        style: { backgroundColor: "#FFEB3B", color: "black" },
      });
    }
  };

  const getLanguage = () => {
    switch (category) {
      case "JavaScript":
      case "Typescript":
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
        Titre
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

      <label
        htmlFor="category"
        className={`${
          darkMode ? "text-gray-300" : "text-gray-800"
        } text-md font-semibold`}
      >
        Language
      </label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={`${
          darkMode
            ? "bg-zinc-800 border-zinc-700 text-gray-400 w-full p-2 rounded mb-4 outline-none focus:ring-1 focus:ring-black/20"
            : "w-full p-2 border border-gray-300 rounded mb-4 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-black/20"
        }`}
        required
      >
        <option value="">Sélectionnez une catégorie</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

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
          {isPublic
            ? "Supprimer de la communauté"
            : "Partager avec la communauté"}
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
        {initialData ? "Modifier Snippet" : "Ajouter Snippet"}
      </button>
    </div>
  );
};

export default SnippetForm;
