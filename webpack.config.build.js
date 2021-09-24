const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, './src/index.tsx'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: "./",
        filename: 'js/[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /.(scss|css)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
        ]
    },
    plugins: [

    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    }
};
