const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, './example/index.tsx'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
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
            {
                test: /\.(png|gif|jpeg)/,
                exclude: /node_modules/,
                use: [{
                    loader: 'url-loader'
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './public/index.html'),
        })
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    devServer: {
        hot: true,
        historyApiFallback: true,
        port: 9000,
        host: '0.0.0.0'
    },
    devtool: 'eval-source-map'
};
