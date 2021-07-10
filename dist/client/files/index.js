// eslint-disable-next-line
// @ts-ignore
import { logger } from "@appist/kit/util";
// eslint-disable-next-line
// @ts-ignore
import { getServer } from "./server.js";
// eslint-disable-next-line
// @ts-ignore
import { init, render } from "../output/server/app.js";
// eslint-disable-next-line
// @ts-ignore
import { host, port } from "./env.js";
init();
const instance = getServer({ render }).listen(port, host, () => {
    logger.info(`The server is listening on http://${host}:${port}...`);
});
export { instance };
