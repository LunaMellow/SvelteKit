declare namespace _default {
    const preprocess: import("svelte-preprocess/dist/types").PreprocessorGroup[];
    namespace kit {
        const adapter: import("@sveltejs/kit").Adapter;
        namespace files {
            const assets: string;
            const hooks: string;
            const lib: string;
            const routes: string;
            const serviceWorker: string;
            const template: string;
        }
        const target: string;
        namespace vite {
            const clearScreen: boolean;
            const envDir: string;
            const mode: string;
        }
    }
}
export default _default;
