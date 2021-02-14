import { promises as fs } from 'fs'
import glob from 'fast-glob'
import path from 'path'

export async function readPubspec(
  directory: string,
  defaults: { name: string; sdk: string }
): Promise<string> {
  const files = await glob('pubspec.{yaml,yml}', {
    cwd: directory,
  })

  if (files.length == 0) {
    return `
name: ${defaults.name}
environment:
  sdk: ${defaults.sdk}
`
  } else {
    const data = await fs.readFile(path.join(directory, files[0]), 'utf-8')
    return data
  }
}
