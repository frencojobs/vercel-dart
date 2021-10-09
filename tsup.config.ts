import type {Options} from 'tsup'
export const tsup: Options = {
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  format: ['cjs'],
  env: {VDR_DEBUG: process.env.VDR_DEBUG as string},
  onSuccess: 'npm run copy-extras',
  skipNodeModulesBundle: true,
  entryPoints: ['src/index.ts']
}
