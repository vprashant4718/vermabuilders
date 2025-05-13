/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // ✅ Correct way
  ],theme: {
  extend: {
    spacing: {
      '10': '2.5rem'  // correct way to extend spacing
    }
  }
},
  plugins: [
    require('flowbite/plugin') // ✅ Use this, not flowbite-react
  ],
};

