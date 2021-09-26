import type {Options} from 'tsup'
export const tsup: Options = {
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  format: ['esm'],
  entryPoints: ['src/index.ts']
}
