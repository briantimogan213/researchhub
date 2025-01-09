/** @type {import('tailwindcss').Config} */
import path from "path"



function joinPath(...pathname) {
  return path.join(__dirname, ...pathname)
}

module.exports = {
  content: [
    joinPath("src", "**", "*.{html,php,js,jsx,mjs,tsx,ts}"),
    joinPath("public", "jsx", "react-app.umd.js"),
    joinPath("src", "Views", "react", "src", "**", "*.tsx"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

