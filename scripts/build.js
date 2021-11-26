// @ts-check

const esbuild = require('esbuild');
const path = require('path')

esbuild.build({
    entryPoints: [
        path.resolve(__dirname, '../src/index.ts')
    ],
    bundle: true,
    outdir: path.resolve(__dirname, '../dist'),
    format: 'cjs',
    external: [
        '@babel/plugin-syntax-typescript'
    ]
})
