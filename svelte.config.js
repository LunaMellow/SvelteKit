import sveltePreprocess from "svelte-preprocess";
import { windi as svelteWindiCSSPreprocess } from "svelte-windicss-preprocess";

export default {
  preprocess: [
    svelteWindiCSSPreprocess({}),
    sveltePreprocess({
      postcss: true,
      typescript: {
        tsconfigFile: "./tsconfig.ui.json",
      },
    }),
  ],
};
