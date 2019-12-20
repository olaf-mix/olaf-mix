const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const olaf = require('../index.js')

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: path.resolve(__dirname, '..', 'test', 'index.ts'),
    output: {
        library: 'main',
        libraryTarget: 'umd',
        filename: 'index._webpack.js',
        path: path.resolve(__dirname, '..', 'test'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    path.resolve(__dirname, '../index.js'),
                ],

            },
            {
                test: /\.tsx?$/,
                loader: [
                    'ts-loader',
                    {
                        loader: path.resolve(__dirname, '../index.js'),
                        options: {
                            parser: 'ts'
                        }
                    }
                ]
            }
        ]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, '..', 'packages')]
    },
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({
                minify: (file, sourceMap) => {
                    const extractedComments = [];
                    const { error, map, code, warnings } = require('uglify-js')
                        .minify(file, {
                            /* Your options for minification */
                        });
                    return { error, map, code, warnings, extractedComments };
                },
            }),
        ],
    }
};