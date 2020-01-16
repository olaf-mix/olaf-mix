const resolve  = require('@rollup/plugin-node-resolve');
const commonjs  = require('rollup-plugin-commonjs');
const babel  = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');
const typescript = require('@rollup/plugin-typescript');
const path = require('path');
const olaf = require('../index.js');

module.exports = () => {
    return [/*{
        input: path.resolve(__dirname, '..', 'test', 'index.js'),
        output: {
            name: 'main',
            globals: {
                md5: 'md5'
            },
            file: path.resolve(__dirname, '..', 'test', 'index.output.js'),
            format: 'umd'
        },
        plugins: [
            olaf(),
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
        ],
        external: [ 'md5' ],
        treeshake: true
    }, */{
        input: path.resolve(__dirname, '..', 'test', 'index.ts'),
        output: {
            name: 'maints',
            globals: {
                // md5: 'md5'
            },
            file: path.resolve(__dirname, '..', 'test', 'index.typescript.output.js'),
            format: 'umd'
        },
        plugins: [
            olaf(),
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
            typescript({lib: ["es5", "es6", "dom"], target: "es5"}),
            // uglify()
        ],
        // external: [ 'md5' ],
        treeshake: true
    }]
};