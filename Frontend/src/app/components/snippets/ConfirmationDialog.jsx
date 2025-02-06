import React from "react";
import { useTheme } from "@/app/context/ThemeContext";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => {
  const { darkMode } = useTheme();
  if (!isOpen) return null;

  return (
    <div
      className={`${
        darkMode ? "bg-zinc-700 text-gray-300" : "bg-white"
      } fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
    >
      <div
        className={`${
          darkMode ? "bg-zinc-700 text-gray-300" : "bg-white"
        } p-6 rounded-lg shadow-lg w-96`}
      >
        <p
          className={`${
            darkMode ? "text-gray-300" : "text-gray-800"
          } text-center`}
        >
          {message}
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
