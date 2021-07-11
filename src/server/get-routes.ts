import type { Route } from "./server";
import { HTTP_METHODS, getFilenames } from "./init-routes";
import routeFromFilename from "./route-from-filename";

export default async function getRoutes(): Promise<Array<Route>> {
  const routes: Array<Route> = [];
  const filenames = await getFilenames();

  await Promise.all(
    filenames.map(async (fn: string) => {
      if (fn.endsWith(process.env.NODE_ENV === "development" ? ".ts" : ".js")) {
        const mod = await import(fn);
        const route = routeFromFilename(fn);

        for (const method of Object.keys(mod)) {
          if (typeof mod[method] !== "function" || HTTP_METHODS.indexOf(method) < 0) {
            continue;
          }

          routes.push({
            method: method === "del" ? "delete" : method,
            pattern: route,
            location: `${fn.replace(`${process.cwd()}/`, "")}#${method}()`,
          });
        }
      }
    })
  );

  return routes.sort((a, b) => a.pattern.charCodeAt(0) - b.pattern.charCodeAt(0));
}
