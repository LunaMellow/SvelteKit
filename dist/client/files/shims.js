import { createRequire } from "module";
// eslint-disable-next-line
// @ts-ignore
export { fetch, Response, Request, Headers } from "@sveltejs/kit/install-fetch";
// esbuild automatically renames "require"
// So we still have to use Object.defineProperty here
Object.defineProperty(globalThis, "require", {
    enumerable: true,
    value: createRequire(import.meta.url),
});
