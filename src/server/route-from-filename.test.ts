import { config } from "../util";
import routeFromFilename from "./route-from-filename";

describe("util", () => {
  describe("#routeFromFilename", () => {
    const testCases = {
      index: "/",
      "orgs/index": "/orgs",
      "[org]/[id]": "/:org/:id",
      "[org]-[id]": "/:org-:id",
      "orgs/[org]-[id]": "/orgs/:org-:id",
      "[org]/[repo]/tree/[branch]/[...file]": "/:org/:repo/tree/:branch/:file*",
      "[org]/[repo]/tree/[...branch]/[file]": "/:org/:repo/tree/:branch*/:file",
    };

    for (const [fn, route] of Object.entries(testCases)) {
      for (const ext of [".js", ".ts"]) {
        test(`filename '${fn}${ext}' should map to the route '${route}'`, () => {
          expect(routeFromFilename(`${config.serverPath}/${fn}${ext}`)).toBe(route);
        });
      }
    }
  });
});
