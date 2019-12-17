const resolve  = require('@rollup/plugin-node-resolve');
const commonjs  = require('rollup-plugin-commonjs');
const babel  = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');
const path = require('path');
// const olaf = require('../packages/rollup-plugin-olaf-mix/index.js');

module.exports = () => {
    return {
        input: path.resolve(__dirname, '..', 'example/input/index.js'),
        output: {
            name: 'olaf_mix',
            globals: {
                md5: 'md5'
            },
            file: path.resolve(__dirname, '..', 'example/dist/index._rollup.js'),
            format: 'umd'
        },
        plugins: [
            // olaf(),
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