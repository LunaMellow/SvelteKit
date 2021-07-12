import rollupAnalyze from "rollup-plugin-analyzer";
import rollupBundleSize from "rollup-plugin-bundle-size";
import rollupCommonJS from "@rollup/plugin-commonjs";
import rollupResolve from "@rollup/plugin-node-resolve";
import rollupTypescript from "@rollup/plugin-typescript";
import rollupSvelte from "rollup-plugin-svelte";
import { terser as rollupTerser } from "rollup-plugin-terser";
import pkg from "./package.json";
import svelteConfig from "./svelte.config";

const { name } = pkg;
const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/ui/index.ts",
  output: [
    {
      file: pkg.exports["./ui"].import,
      format: "es",
      sourcemap: true,
      name,
    },
  ],
  plugins: [
    rollupSvelte({
      compilerOptions: {
        dev: !production,
        hydratable: true,
      },
      preprocess: svelteConfig.preprocess,
      emitCss: false,
    }),
    rollupResolve(),
    rollupCommonJS(),
    rollupTypescript({ tsconfig: "./tsconfig.ui.json" }),
    production && rollupTerser(),
    production && rollupAnalyze(),
    production && rollupBundleSize(),
  ],
};
