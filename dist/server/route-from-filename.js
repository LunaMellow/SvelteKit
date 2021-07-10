import { extname } from "path";
import { config } from "../util";
const SUPPORTED_EXTS = [".js", ".ts"];
export default function routeFromFilename(fn) {
    if (SUPPORTED_EXTS.indexOf(extname(fn)) < 0)
        return "";
    const segments = fn
        .replace(`${process.cwd()}/${config.serverPath}/`, "")
        .replace(`${config.serverPath}/`, "")
        .replace(/\.(js|ts)/, "")
        .split("/");
    if (segments.length === 1 && segments[0].startsWith("index"))
        return "/";
    let route = "/";
    for (let i = 0; i < segments.length; i++) {
        if (i === segments.length - 1 && segments[i].startsWith("index"))
            break;
        if (!route.endsWith("/"))
            route += "/";
        if (/\[(\.\.\.)([0-9a-zA-Z]*)\]/.test(segments[i])) {
            route += `${segments[i].replace(/\[\.\.\.([0-9a-zA-Z]*)\]/g, ":$1*")}`;
        }
        else {
            route += `${segments[i].replace(/\[([0-9a-zA-Z]*)\]/g, ":$1")}`;
        }
    }
    return route;
}
