import { build } from "esbuild";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath, URL } from "url";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default ({ out = "dist" } = {}) => {
    /** @type {import('@sveltejs/kit').Adapter} */
    const adapter = {
        name: "@appist/kit/adapter-node",
        async adapt({ utils, config }) {
            utils.rimraf(out);
            const static_directory = join(out, "assets");
            utils.copy_client_files(static_directory);
            utils.copy_static_files(static_directory);
            const files = fileURLToPath(new URL("./files", import.meta.url));
            utils.copy(files, ".svelte-kit/node");
            writeFileSync(".svelte-kit/node/env.js", "export const host = process.env['HOST'] || '0.0.0.0';\nexport const port = process.env['PORT'] || 3000;");
            await build({
                entryPoints: [".svelte-kit/node/index.js"],
                outfile: join(out, "index.js"),
                bundle: true,
                external: Object.keys(JSON.parse(readFileSync("package.json", "utf8")).dependencies || {}),
                format: "esm",
                platform: "node",
                target: "node12",
                inject: [join(files, "shims.js")],
            });
            await utils.prerender({
                dest: `${out}/prerendered`,
            });
        },
    };
    return adapter;
};
