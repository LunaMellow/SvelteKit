module.exports = {
  darkMode: "class",
  mode: "jit",
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
  purge: {
    content: ["./src/ui/**/*.{html,svelte}"],
  },
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
};
