import {
  BuildOptions,
  Env,
  Lambda,
  createLambda,
  debug,
  download,
  getWriteableDirectory,
  glob,
  shouldServe,
} from '@vercel/build-utils'
import { chmodSync, promises as fs } from 'fs'
import execa from 'execa'
import fg from 'fast-glob'
import path from 'path'
import process from 'process'
import yaml from 'js-yaml'

const SDK_VERSION = '">=2.6.0 <3.0.0"'
const RUNTIME_PKG = {
  git: {
    url: 'https://github.com/frencojobs/vercel-dart',
    path: 'dart',
  },
}

chmodSync(path.join(__dirname, 'build.sh'), 0o755)

async function readPubspec(
  directory: string,
  { name, sdk }: { name: string; sdk: string }
): Promise<string> {
  const files = await fg('pubspec.{yaml,yml}', {
    cwd: directory,
  })

  if (files.length == 0) {
    return `
    name: ${name}
    environment:
      sdk: ${sdk}
    `
  } else {
    const data = await fs.readFile(path.join(directory, files[0]), 'utf-8')
    return data
  }
}

function makePubspec(input: string): string {
  const data = (yaml.load(input) as any) ?? {}

  return yaml.dump({
    ...data,
    dependencies: {
      ...(data?.dependencies ?? {}),
      vercel_dart: RUNTIME_PKG,
    },
  })
}

// Implementation taken from https://github.com/mike-engel/now-rust/blob/master/src/index.ts
async function gatherExtraFiles(
  globMatcher: string | string[] | undefined,
  entrypoint: string
) {
  if (!globMatcher) return {}
  debug('Gathering extra files')
  const entryDir = path.dirname(entrypoint)
  if (Array.isArray(globMatcher)) {
    const allMatches = await Promise.all(
      globMatcher.map((pattern) => glob(pattern, entryDir))
    )
    return allMatches.reduce((acc, matches) => ({ ...acc, ...matches }), {})
  }
  return glob(globMatcher, entryDir)
}

const version = 3
async function build({
  files,
  entrypoint,
  workPath,
  config = {},
  meta = {},
}: BuildOptions): Promise<{ output: Lambda }> {
  const { devCacheDir = path.join(workPath, '.vercel', 'cache') } = meta
  const distPath = path.join(devCacheDir, 'dart', entrypoint)

  debug('Downloading files')
  const downloadedFiles = await download(files, workPath, meta)
  const entrypointFilePath = downloadedFiles[entrypoint].fsPath

  debug('Writing `pubspec.yaml` file')
  const tmp = await getWriteableDirectory()
  const pubspec = await readPubspec(path.dirname(entrypointFilePath), {
    name: path.basename(entrypoint, 'dart').replace(/[\W_]+/g, '_'),
    sdk: SDK_VERSION,
  })
  await fs.writeFile(
    path.join(tmp, 'pubspec.yaml'),
    makePubspec(pubspec),
    'utf-8'
  )

  const env: Env = {
    ...process.env,
    TMP: tmp,
    DIST: distPath,
    BUILDER: __dirname,
    ENTRYPOINT: entrypoint,
    ENTRYPOINT_PATH: entrypointFilePath,
    VERCEL_DEV: meta.isDev ? '1' : '0',
  }

  debug('Running `build.sh`')
  await execa(path.join(__dirname, 'build.sh'), [], {
    env,
    cwd: workPath,
    stdio: 'inherit',
    shell: '/bin/bash',
  })

  const extraFiles = await gatherExtraFiles(
    config.includeFiles,
    entrypointFilePath
  )

  const output = await createLambda({
    files: { ...extraFiles, ...(await glob('**', distPath)) },
    handler: 'bootstrap',
    runtime: 'provided',
  })

  return { output }
}

export { version, build, shouldServe }
