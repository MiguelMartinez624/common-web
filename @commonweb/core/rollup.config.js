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
                sourcemap:  false,
            },
            {
                file: `${name}.mjs`,
                format: 'es',
                sourcemap: false,
            },

        ],
    }),
    bundle({
        input: './dist/dts/index.d.ts',
        plugins: [dts()],
        output: {
            file: `${name}.d.ts`,
            format: 'es',
        },
    }),
]
