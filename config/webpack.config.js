const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: './example/input/index.js',
    output: {
        library: 'olaf_mix',
        libraryTarget: 'umd',
        filename: 'index._webpack.js',
        path: path.resolve(__dirname, '..', 'example', 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'olaf-mix-loader',
                ]
            }
        ]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, '..', 'packages')]
    },
    optimization: {
        minimize: true,
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