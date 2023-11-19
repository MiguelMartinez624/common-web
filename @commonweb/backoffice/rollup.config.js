import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import serve from "rollup-plugin-serve";
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'

const outputPath = `./dist/backoffice.js`;

const bundle = config => ({
    ...config,
    input: 'src/index.ts',
    external: id => !/^[./]/.test(id),
})
export default {
    input: './src/index.ts',
    output: [{
        file: outputPath,
        format: 'es'
    }, {
        file: "dist/bundle.js",
        format: "umd",
        name: "myModule",
    }],
    plugins: [
        esbuild(),
        resolve(),
        serve({
            open: true,
            port: 8080,
            contentBase: "dist",
        }),
        terser({
            mangle: true,
            toplevel: true,
            compress: {
                // drop_console:true,
                // drop_debugger:true,
                arrows: true,
            },
        }),
        commonJS({
            include: 'node_modules/**'
        })
    ]
};

