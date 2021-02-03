import fs from "fs";
import { join } from "path";
import {
  BuildOptions,
  createLambda,
  download,
  Env,
  glob,
  Lambda,
  shouldServe,
} from "@vercel/build-utils";
import execa from "execa";

fs.chmodSync(join(__dirname, "build.sh"), 0o755);

const version = 1;
async function build({
  files,
  entrypoint,
  workPath,
  meta = {},
}: BuildOptions): Promise<{ output: Lambda }> {
  const { devCacheDir = join(workPath, ".vercel", "cache") } = meta;
  const distPath = join(devCacheDir, "dart", entrypoint);

  await download(files, workPath, meta);

  const { HOME, PATH } = process.env;
  const env: Env = {
    ...process.env,
    PATH: `${join(HOME!, "/usr/lib/dart/bin")}:${PATH}`,
    DIST: distPath,
    BUILDER: __dirname,
    ENTRYPOINT: entrypoint,
    VERCEL_DEV: meta.isDev ? "1" : "0",
  };

  await execa(join(__dirname, "build.sh"), [], {
    env,
    cwd: workPath,
    stdio: "inherit",
    shell: "/bin/bash",
  });

  const output = await createLambda({
    files: await glob("**", distPath),
    handler: "bootstrap",
    runtime: "provided",
  });

  return { output };
}

export { version, build, shouldServe };
