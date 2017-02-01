var webpack = require("webpack");

module.exports = {
    entry: ['./app/script.js'],
    output: {
        filename: 'script.min.js',
        path: './js'
    },
    module: {
        loaders: [{
            test: /.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}
