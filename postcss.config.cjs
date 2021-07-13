module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: {},
    "postcss-100vh-fix": {},
    "postcss-import": {},
    "postcss-preset-env": {
      stage: 1,
      features: {
        "nesting-rules": true,
      },
    },
    ...(process.env.NODE_ENV === "development" ? {} : { cssnano: { preset: "default" } }),
  },
};
