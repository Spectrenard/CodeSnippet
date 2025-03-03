import { useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { updateUsername } from "../../../api/users";
import { toast } from "react-toastify";

export default function UserInfo({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const { darkMode } = useTheme();

  const handleUsernameUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await updateUsername(token, newUsername);

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        toast.success("Username updated successfully !", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("Error updating username");
    }
  };

  return (
    <div
      className={`${
        darkMode ? "border-t border-zinc-700" : "border-t border-gray-200"
      } pt-6`}
    >
      <h3
        className={`${
          darkMode ? "text-gray-200" : "text-gray-800"
        } text-xl font-semibold mb-6 flex flex-wrap items-center`}
      >
        <span
          className={`${
            darkMode ? "bg-zinc-700" : "bg-indigo-100"
          } rounded-lg px-4 py-2`}
        >
          Login information
        </span>
      </h3>
      <div
        className={`${
          darkMode ? "bg-zinc-700" : "bg-gray-50"
        } space-y-6 rounded-lg p-4 sm:p-6`}
      >
        <div
          className={`${
            darkMode ? "hover:bg-zinc-800" : "hover:bg-white"
          } flex flex-col sm:flex-row items-start sm:items-center p-3 rounded-lg transition-all duration-300 gap-2 sm:gap-0`}
        >
          <span
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } sm:w-40 font-medium`}
          >
            Username:
          </span>
          {isEditing ? (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className={`${
                  darkMode ? "bg-zinc-700 text-gray-200" : "bg-white"
                } px-2 py-1 border rounded flex-1 sm:flex-none`}
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleUsernameUpdate}
                  className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex-1 sm:flex-none"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewUsername(user?.username || "");
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex-1 sm:flex-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium text-indigo-600">
                {user?.username}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-indigo-500"
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        <div
          className={`${
            darkMode ? "hover:bg-zinc-800" : "hover:bg-white"
          } flex flex-col sm:flex-row items-start sm:items-center p-3 rounded-lg transition-all duration-300 gap-2 sm:gap-0`}
        >
          <span
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } sm:w-40 font-medium`}
          >
            Login method:
          </span>
          <span className="font-medium text-indigo-600">
            {user?.provider === "google"
              ? "Google"
              : user?.provider === "github"
              ? "GitHub"
              : "Email"}
          </span>
        </div>

        <div
          className={`${
            darkMode ? "hover:bg-zinc-800" : "hover:bg-white"
          } flex flex-col sm:flex-row items-start sm:items-center p-3 rounded-lg transition-all duration-300 gap-2 sm:gap-0`}
        >
          <span
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } sm:w-40 font-medium`}
          >
            Member since:
          </span>
          <span className="font-medium text-indigo-600">
            {new Date(user?.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
