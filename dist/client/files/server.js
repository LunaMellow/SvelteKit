// eslint-disable-next-line
// @ts-ignore
import { initRoutes } from "@appist/kit/server";
// eslint-disable-next-line
// @ts-ignore
import { config } from "@appist/kit/util";
// eslint-disable-next-line
// @ts-ignore
import { getRawBody } from "@sveltejs/kit/node";
import compression from "compression";
import fs from "fs";
import { createServer } from "http";
import httpProxy from "http-proxy";
import { join } from "path";
import polka from "polka";
import sirv from "sirv";
import stoppable from "stoppable";
const noop_handler = (req, res, next) => next();
const paths = {
    assets: join(config.outDir, "/assets"),
    prerendered: join(config.outDir, "/prerendered"),
};
const immutable_path = (pathname) => {
    // eslint-disable-next-line
    // @ts-ignore
    let app_dir = "_app";
    // hard to tell when app_dir is mixed with static
    if (app_dir === "/") {
        return false;
    }
    if (app_dir.startsWith("/")) {
        app_dir = app_dir.slice(1);
    }
    if (app_dir.endsWith("/")) {
        app_dir = app_dir.slice(0, -1);
    }
    return pathname.startsWith(`/${app_dir}/`);
};
const prerenderedHandler = fs.existsSync(paths.prerendered)
    ? sirv(paths.prerendered, {
        etag: true,
        maxAge: 0,
        gzip: true,
        brotli: true,
    })
    : noop_handler;
const assetsHandler = fs.existsSync(paths.assets)
    ? sirv(paths.assets, {
        setHeaders: (res, pathname) => {
            if (immutable_path(pathname)) {
                res.setHeader("cache-control", "public, max-age=31536000, immutable");
            }
        },
        gzip: true,
        brotli: true,
    })
    : noop_handler;
const proxy = httpProxy.createProxyServer({
    target: {
        host: "localhost",
        port: `${parseInt(config.port) + 1}`,
    },
});
// eslint-disable-next-line
proxy.on("error", (err) => { });
// eslint-disable-next-line
// @ts-ignore
const onNoMatchHandler = (render) => {
    return async (req, res) => {
        if (process.env.NODE_ENV === "development") {
            return proxy.web(req, res);
        }
        let body;
        try {
            body = await getRawBody(req);
        }
        catch (err) {
            res.statusCode = err.status || 400;
            return res.end(err.reason || "Invalid request body");
        }
        const parsed = new URL(req.url || "", "http://localhost");
        const rendered = await render({
            method: req.method,
            headers: req.headers,
            path: parsed.pathname,
            query: parsed.searchParams,
            rawBody: body,
        });
        if (rendered) {
            res.writeHead(rendered.status, rendered.headers);
            res.end(rendered.body);
        }
        else {
            res.statusCode = 404;
            res.end("Not found");
        }
    };
};
// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
export function getServer({ render } = { render: () => { } }) {
    const httpServer = stoppable(createServer(), config.serverGracefulShutdownTimeout);
    if (process.env.NODE_ENV === "development") {
        httpServer.on("upgrade", (req, socket, head) => {
            proxy.ws(req, socket, head);
        });
    }
    const server = polka({ server: httpServer, onNoMatch: onNoMatchHandler(render) }).use(compression({ threshold: 0 }), assetsHandler, prerenderedHandler);
    initRoutes(server);
    return server;
}
export function closeProxyServer() {
    proxy.close();
}
