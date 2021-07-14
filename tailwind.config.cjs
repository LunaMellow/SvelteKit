const colors = require("tailwindcss/colors");

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
    content: ["./docs/**/*.{html,svelte}", "./src/ui/**/*.{html,svelte}"],
  },
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.coolGray,
        success: colors.green,
        info: colors.sky,
        warning: colors.amber,
        danger: colors.red,
        dark: colors.coolGray,
        light: colors.coolGray,
      },
    },
  },
  variants: {
    extend: {},
  },
};
