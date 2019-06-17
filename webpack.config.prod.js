const webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/index.js',
        DynamicGroup: './src/components/dynamicGroupTab/DynamicGroupTab.js',
        DiscountCodes: './src/components/discountCodesTab/DiscountCodesTab.js'
    },
    // devtool: 'eval-source-map',
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                    test: /\.scss$/,
                    use: [
                      {
                        loader: "style-loader" // creates style nodes from JS strings
                      },
                      {
                        loader: "css-loader" // translates CSS into CommonJS
                      },
                      {
                        loader: "sass-loader" // compiles Sass to CSS
                      }
                    ]
                  },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf)(\?[a-z0-9=.]+)?$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: '[name].js',
    },
    plugins: [
        // new webpack.DefinePlugin({
        //          'process.env.NODE_ENV': '"production"'
        // }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    }
};
