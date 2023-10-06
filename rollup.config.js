import packageJson from './package.json' assert {type: 'json'};

const name = packageJson.main.replace(/\.js$/, '');
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';

const bundle = config => ({
    ...config,
    input: 'src/index.ts',
    external: id => !/^[./]/.test(id),
})

export default [
    bundle({
        plugins: [esbuild({
            exclude: ["**/__tests__", "**/*.tsest.ts"]
        })],
        output: [
            {
                file: `${name}.js`,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: `${name}.mjs`,
                format: 'es',
                sourcemap: true,
            },
            {
                file: `${name}.min.js`,
                format: 'iife',
                name: 'version',
                plugins: [terser({
                    compress: {
                        module: true,
                        toplevel: true,
                        unsafe_arrows: true,
                        drop_console: true,
                        drop_debugger: true
                    },
                })]
            }
        ],
    }),
    bundle({
        plugins: [dts()],
        output: {
            file: `${name}.d.ts`,
            format: 'es',
        },
    }),
]
