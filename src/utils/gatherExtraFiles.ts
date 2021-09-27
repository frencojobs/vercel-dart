import {debug, Files, glob} from '@vercel/build-utils'
import path from 'path'

// Implementation taken from https://github.com/mike-engel/now-rust/blob/master/src/index.ts
export async function gatherExtraFiles(
  globMatcher: string | string[] | undefined,
  entrypoint: string
): Promise<Files> {
  if (!globMatcher) return {}
  debug('Gathering extra files...')
  const entryDir = path.dirname(entrypoint)
  if (Array.isArray(globMatcher)) {
    const allMatches = await Promise.all(
      globMatcher.map((pattern) => glob(pattern, entryDir))
    )
    return allMatches.reduce((acc, matches) => ({...acc, ...matches}), {})
  }
  return glob(globMatcher, entryDir)
}
