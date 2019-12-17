import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import olaf from '../packages/rollup-plugin-olaf-mix/index.js';


module.exports = () => {
    return {
        input: './example/input/index.js',
        output: {
            name: 'olaf_mix',
            globals: {
                md5: 'md5'
            },
            file: './example/dist/index.js',
            format: 'umd'
        },
        plugins: [
            olaf(),
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
            uglify({
                compress: {
                    drop_debugger: false,
                    // assignments: false,
                    // collapse_vars: false,
                    // directives: false,
                    // evaluate: false,
                    // expression: false,
                    // hoist_props: false,
                    // keep_infinity: false,
                    // properties: false,
                    // reduce_vars: false,
                }
            }),
        ],
        external: [ 'md5' ],
        treeshake: true
    }
};