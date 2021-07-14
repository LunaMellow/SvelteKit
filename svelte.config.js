import { mdsvex } from "mdsvex";
import sveltePreprocess from "svelte-preprocess";
import adapterStatic from "@sveltejs/adapter-static";

const docDir = "docs";

export default {
  extensions: [".svelte", ".svx"],
  kit: {
    adapter: adapterStatic(),
    files: {
      assets: `${docDir}/static`,
      hooks: `${docDir}/hooks`,
      lib: `${docDir}/lib`,
      routes: `${docDir}/routes`,
      serviceWorker: `${docDir}/service-worker`,
      template: `${docDir}/app.html`,
    },
    target: "#svelte",
  },
  preprocess: [
    mdsvex({
      extensions: [".svx"],
      layout: "docs/routes/__layout.svelte",
    }),
    sveltePreprocess({
      postcss: true,
      typescript: {
        tsconfigFile: "./tsconfig.ui.json",
      },
    }),
  ],
};
