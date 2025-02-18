import { useTheme } from "../../context/ThemeContext";
import { categoryStyles } from "../../../utils/categoryStyles";

const TrendingSidebar = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-zinc-800" : "bg-white"
      } p-4 rounded-lg shadow sticky top-4`}
    >
      <h2
        className={`${
          darkMode ? "text-gray-200" : "text-gray-800"
        } font-bold text-lg mb-4`}
      >
        Trending
      </h2>
      <div className="space-y-3">
        <p
          className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}
        >
          Most popular categories :
        </p>
        {Object.keys(categoryStyles)
          .slice(0, 5)
          .map((cat) => (
            <div key={cat} className="flex items-center justify-between">
              <span
                className={`px-3 py-1  rounded-full text-sm font-bold ${categoryStyles[cat]}`}
              >
                {cat}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TrendingSidebar;
