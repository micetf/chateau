var webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        script: ["./app/script.js", "./app/paypal.js", "./app/contact.js"],
    },
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname, "js"),
    },
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }],
                        ],
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
    ],
};
