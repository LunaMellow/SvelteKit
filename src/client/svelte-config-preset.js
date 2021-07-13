import sveltePreprocess from "svelte-preprocess";
import { default as adapterNode } from "./adapter-node.js";
import { getConfig } from "../util/config.js";

const config = getConfig();
const clientDir = `${config.rootDir}/client`;

export default {
  preprocess: [
    sveltePreprocess({
      postcss: true,
    }),
  ],
  kit: {
    adapter: adapterNode({ out: config.outDir }),
    files: {
      assets: `${clientDir}/static`,
      hooks: `${clientDir}/hooks`,
      lib: `${clientDir}/lib`,
      routes: `${clientDir}/pages`,
      serviceWorker: `${clientDir}/service-worker`,
      template: `${clientDir}/app.html`,
    },
    target: "#svelte",
    vite: {
      clearScreen: false,
      envDir: config.envDir,
      mode: process.env.KIT_ENV || "development",
    },
  },
};
