const resolve  = require('@rollup/plugin-node-resolve');
const commonjs  = require('rollup-plugin-commonjs');
const babel  = require('rollup-plugin-babel');
const typescript = require('rollup-plugin-typescript');
const path = require('path');

module.exports = () => {
    return {
        input: path.resolve(__dirname, 'input.ts'),
        output: {
            name: 'main',
            globals: {
                md5: 'md5'
            },
            file: path.resolve(__dirname, 'output.js'),
            format: 'umd'
        },
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
            typescript()
        ],
        treeshake: true
    }
};