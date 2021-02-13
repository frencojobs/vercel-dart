require('esbuild').build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  tsconfig: 'tsconfig.json',
  target: 'es6',
  sourcemap: 'external',
  plugins: [
    require('@esbuild-plugins/node-resolve').default({
      extensions: ['.ts', '.js'],
      onResolved: (resolved) => {
        if (resolved.includes('node_modules')) {
          return {
            external: true,
          }
        }
        return resolved
      },
    }),
  ],
})
