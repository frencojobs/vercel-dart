import { chmodSync, promises as fs } from "fs";
import path from "path";
import {
  BuildOptions,
  createLambda,
  download,
  Env,
  getWriteableDirectory,
  glob,
  Lambda,
  shouldServe,
} from "@vercel/build-utils";
import execa from "execa";
import fg from "fast-glob";
import process from "process";
import yaml from "js-yaml";

chmodSync(path.join(__dirname, "build.sh"), 0o755);

async function readPubspec(
  directory: string,
  { name, sdk }: { name: string; sdk: string }
): Promise<string> {
  const files = await fg("pubspec.{yaml,yml}", {
    cwd: directory,
  });

  if (files.length == 0) {
    return `
    name: ${name}
    environment:
      sdk: ${sdk}
    `;
  } else {
    const data = await fs.readFile(path.join(directory, files[0]), "utf-8");
    return data;
  }
}

function makePubspec(input: string): string {
  const data = (yaml.load(input) as any) ?? {};

  return yaml.dump({
    ...data,
    dependencies: {
      ...(data?.dependencies ?? {}),
      vercel_dart: {
        path: "/home/frenco/work/oss/vercel-dart/dart",
      },
    },
  });
}

const version = 1;
async function build({
  files,
  entrypoint,
  workPath,
  meta = {},
}: BuildOptions): Promise<{ output: Lambda }> {
  const { devCacheDir = path.join(workPath, ".vercel", "cache") } = meta;
  const distPath = path.join(devCacheDir, "dart", entrypoint);

  const tmp = await getWriteableDirectory();
  const pubspec = await readPubspec(path.dirname(entrypoint), {
    name: path.basename(entrypoint, "dart").replace("[", "_").replace("]", "_"),
    sdk: ">=2.6.0 <3.0.0",
  });
  await fs.writeFile(
    path.join(tmp, "pubspec.yaml"),
    makePubspec(pubspec),
    "utf-8"
  );

  await download(files, workPath, meta);

  const env: Env = {
    ...process.env,
    TMP: tmp,
    DIST: distPath,
    BUILDER: __dirname,
    ENTRYPOINT: entrypoint,
    VERCEL_DEV: meta.isDev ? "1" : "0",
  };

  await execa(path.join(__dirname, "build.sh"), [], {
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
