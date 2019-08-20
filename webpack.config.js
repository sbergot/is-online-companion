const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
    entry: {
        main: "./src/index.tsx"
    },

    devtool: argv.mode === 'production' ? "" : "eval-source-map",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    output: {
        filename: '[name].bundle.js',
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.json' ]
    },

    plugins: [
        new CopyWebpackPlugin([{ from: './static' }]),
    ],
});