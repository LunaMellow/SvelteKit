import type { Server } from "./server";
import tinyGlob from "tiny-glob";
import { config } from "../util";
import routeFromFilename from "./route-from-filename";

export const HTTP_METHODS = [
  "all",
  "connect",
  "del",
  "get",
  "head",
  "options",
  "patch",
  "post",
  "put",
  "trace",
];

export async function getFilenames(): Promise<string[]> {
  return await tinyGlob(
    `${config.serverPath}/**/!(*.spec|*.test).${
      process.env.NODE_ENV === "development" ? "{ts}" : "{js}"
    }`,
    {
      // Note: Dynamic import needs this to be absolute path.
      absolute: true,
      filesOnly: true,
    }
  );
}

export default async function initRoutes(server: Server): Promise<void> {
  const filenames = await getFilenames();

  filenames.map(async (fn: string) => {
    if (fn.endsWith(process.env.NODE_ENV === "development" ? ".ts" : ".js")) {
      const mod = await import(fn);
      const route = routeFromFilename(fn);

      for (const method of Object.keys(mod)) {
        if (typeof mod[method] !== "function" || HTTP_METHODS.indexOf(method) < 0) {
          continue;
        }

        switch (method) {
          case "all":
            server.all(route, mod[method]);
            break;

          case "connect":
            server.connect(route, mod[method]);
            break;

          case "del":
            server.delete(route, mod[method]);
            break;

          case "get":
            server.get(route, mod[method]);
            break;

          case "head":
            server.head(route, mod[method]);
            break;

          case "options":
            server.options(route, mod[method]);
            break;

          case "patch":
            server.patch(route, mod[method]);
            break;

          case "post":
            server.post(route, mod[method]);
            break;

          case "put":
            server.put(route, mod[method]);
            break;

          case "trace":
            server.trace(route, mod[method]);
            break;
        }
      }
    }
  });
}
