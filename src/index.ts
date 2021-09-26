import {
  BuildOptions,
  createLambda,
  debug,
  download,
  getWriteableDirectory,
  glob,
  Lambda,
  shouldServe
} from '@vercel/build-utils'
import execa from 'execa'
import {chmodSync, promises as fs} from 'fs'
import path from 'path'
import process from 'process'
import {
  DEFAULT_DART_CHANNEL,
  DEFAULT_DART_VERSION,
  RUNTIME_PKG,
  SDK_VERSION
} from './utils/constants'
import {gatherExtraFiles} from './utils/gatherExtraFiles'
import {makePubspec} from './utils/makePubspec'
import {readPubspec} from './utils/readPubspec'

chmodSync(path.join(__dirname, 'install.sh'), 0o755)
chmodSync(path.join(__dirname, 'build.sh'), 0o755)

const version = 3
async function build({
  files,
  entrypoint,
  workPath,
  config = {},
  meta = {}
}: BuildOptions): Promise<{output: Lambda}> {
  const {devCacheDir = path.join(workPath, '.vercel', 'cache')} = meta
  const distPath = path.join(devCacheDir, 'dart', entrypoint)

  const dartChannel = (config.DART_CHANNEL as string) ?? DEFAULT_DART_CHANNEL
  const dartVersion = (config.DART_VERSION as string) ?? DEFAULT_DART_VERSION

  if (!meta.isDev) {
    debug('Installing `dart`...')
    await execa(path.join(__dirname, 'install.sh'), [], {
      env: {
        ...process.env,
        DART_CHANNEL: dartChannel,
        DART_VERSION: dartVersion
      },
      cwd: workPath,
      stdio: 'inherit',
      shell: '/bin/bash'
    })
    debug(`Installed \`dart v${dartVersion}\``)
  }

  debug('Downloading files...')
  const downloadedFiles = await download(files, workPath, meta)
  const entrypointFilePath = downloadedFiles[entrypoint].fsPath

  debug('Writing "pubspec.yaml" file...')
  const tmp = await getWriteableDirectory()
  const pubspec = await readPubspec(path.dirname(entrypointFilePath), {
    name: path.basename(entrypoint, 'dart').replace(/[\W_]+/g, '_'),
    sdk: SDK_VERSION
  })
  await fs.writeFile(
    path.join(tmp, 'pubspec.yaml'),
    makePubspec(pubspec, RUNTIME_PKG),
    'utf-8'
  )

  debug('Building the binary file...')
  await execa(path.join(__dirname, 'build.sh'), [], {
    env: {
      ...process.env,
      PATH: `${process.env.PATH}:${process.env.HOME}/dart-sdk/bin`,
      TMP: tmp,
      DIST: distPath,
      BUILDER: __dirname,
      ENTRYPOINT: entrypoint,
      ENTRYPOINT_PATH: entrypointFilePath
    },
    cwd: workPath,
    stdio: 'inherit',
    shell: '/bin/bash'
  })

  const extraFiles = await gatherExtraFiles(
    config.includeFiles,
    entrypointFilePath
  )

  const output = await createLambda({
    files: {...extraFiles, ...(await glob('**', distPath))},
    handler: 'bootstrap',
    runtime: 'provided'
  })

  return {output}
}

export {version, build, shouldServe}
