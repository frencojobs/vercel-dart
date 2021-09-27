import type {Options} from 'tsup'
export const tsup: Options = {
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  format: ['cjs'],
  env: {NODE_ENV: process.env.NODE_ENV as string},
  onSuccess: 'npm run copy-extras',
  entryPoints: ['src/index.ts']
}
