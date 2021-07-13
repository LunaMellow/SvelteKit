import sveltePreprocess from "svelte-preprocess";

export default {
  preprocess: [
    sveltePreprocess({
      postcss: true,
      typescript: {
        tsconfigFile: "./tsconfig.ui.json",
      },
    }),
  ],
};
