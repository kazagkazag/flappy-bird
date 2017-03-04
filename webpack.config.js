const path = require("path");

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, use: "babel-loader"}
        ]
    }
};
