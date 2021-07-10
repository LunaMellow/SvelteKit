import { dirname } from "dirname-filename-esm";
import { sync as pkgDirSync } from "pkg-dir";
export function enhancedProcessEnv(meta, nodeOpts = true) {
    return {
        ...process.env,
        ...{
            FORCE_COLOR: "1",
            PATH: `${process.env.PATH}:${pkgDir(meta)}/node_modules/.bin:${process.cwd()}/node_modules/.bin`,
            NODE_PATH: `${process.env.NODE_PATH ? `${process.env.NODE_PATH}:` : ""}${pkgDir(meta)}/node_modules:${process.cwd()}/node_modules`,
        },
        ...(nodeOpts
            ? {
                NODE_OPTIONS: "--no-warnings --experimental-specifier-resolution=node --loader ts-node/esm",
            }
            : {}),
    };
}
export function pkgDir(meta) {
    return `${pkgDirSync(dirname(meta))}`;
}
