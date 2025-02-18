/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Frontend
    "bg-yellow-200",
    "text-yellow-800",
    "bg-blue-300",
    "text-blue-900",
    "bg-cyan-200",
    "text-cyan-800",
    "bg-red-200",
    "text-red-800",
    "bg-green-200",
    "text-green-800",
    "bg-orange-300",
    "text-orange-900",
    "bg-gray-800",
    "text-gray-200",

    // Backend
    "bg-green-300",
    "text-green-900",
    "bg-blue-200",
    "text-blue-800",
    "bg-red-300",
    "text-red-900",
    "bg-indigo-300",
    "text-indigo-900",
    "bg-red-400",
    "text-red-950",
    "bg-sky-200",
    "text-sky-800",
    "bg-orange-400",
    "text-orange-950",

    // Autres
    "bg-gray-300",
    "text-gray-800",
    "bg-green-400",
    "text-green-950",
    "bg-pink-400",
    "text-pink-950",
    "bg-purple-300",
    "text-purple-900",
    "bg-blue-400",
    "text-blue-950",
    "bg-yellow-300",
    "text-yellow-900",
    "bg-purple-200",
    "text-purple-800",
    "bg-pink-200",
    "text-pink-800",
  ],
  theme: {
    extend: {
      keyframes: {
        "like-burst": {
          "0%": {
            transform: "scale(0)",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1)",
            opacity: 0.5,
          },
          "100%": {
            transform: "scale(1.5)",
            opacity: 0,
          },
        },
        "bookmark-pop": {
          "0%": {
            transform: "scale(0)",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1.5)",
            opacity: 0.5,
          },
          "100%": {
            transform: "scale(0)",
            opacity: 0,
          },
        },
      },
      animation: {
        "like-burst": "like-burst 0.45s ease-out forwards",
        "bookmark-pop": "bookmark-pop 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
