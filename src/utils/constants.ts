import path from 'path'

export const DEFAULT_DART_CHANNEL = 'stable'
export const DEFAULT_DART_VERSION = '2.14.3'
export const SDK_VERSION = '">=2.12.0 <3.0.0"'
export const RUNTIME_PKG =
  process.env.NODE_ENV === 'debug'
    ? {path: path.join(__dirname, '../dart')}
    : {
        git: {
          url: 'https://github.com/frencojobs/vercel-dart',
          path: 'dart'
        }
      }
