import { execSync } from "child_process";
import { basename } from "path";
import { cmd } from ".";

const DEFAULT_TAG = `${basename(process.cwd())}:latest`;

cmd
  .command("dk:build", "Build the application Docker image. (only for NODE_ENV=development)")
  .option("--file", "The Dockerfile path.", ".docker/Dockerfile")
  .option("--no-cache", "Disable cache when building the image.", "false")
  .option(
    "--progress",
    "Set the progress output type which can be 'auto' (default), 'plain', 'tty'.",
    "auto"
  )
  .option(
    "--tag",
    "Set the name and optionally a tag for the Docker image in 'name:tag' format.",
    DEFAULT_TAG
  )
  .action(async (opts) => {
    try {
      execSync(
        `docker build --file=${opts["file"]} ${opts["no-cache"] ? "--no-cache" : ""} --progress=${
          opts["progress"]
        } --tag=${opts["tag"] ? opts["tag"] : DEFAULT_TAG} .`,
        { stdio: "inherit" }
      );
    } catch (err) {
      process.exit(1);
    }
  });
