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
            exclude: ["**/__tests__", "**/*.test.ts"]
        }),

            // terser({
            //     mangle: true,
            //     toplevel: true,
            //     compress: {arrows: true}
            // })
        ],
        output: [
            {
                file: `${name}.js`,
                format: 'cjs',
                sourcemap: false,
            },
            {
                file: `${name}.mjs`,
                format: 'es',
                sourcemap: false,
            },
            {
                file: `${name}-pkg.js`,
                format: "umd",
                name: "forms",
            }
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
