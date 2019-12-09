import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";


module.exports = () => {
    return {
        input: './dist/_tmp.js',
        output: {
            name: 'olaf_mix',
            globals: {
                md5: 'md5'
            },
            file: './dist/index.js',
            format: 'umd'
        },
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
            uglify()
        ],
        external: [ 'md5' ],
        treeshake: true
    }
};