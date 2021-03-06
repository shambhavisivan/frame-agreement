/* eslint-disable */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = {
	mode: process.env.NODE_ENV,
	devtool : "inline-source-map",
	entry: {
		bundle: ['./src/index.tsx']
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				loader: 'style-loader'
			},
			{
				test: /\.(ts|tsx)?$/,
				use: {
					loader: 'awesome-typescript-loader'
				},
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader' // creates style nodes from JS strings
					},
					{
						loader: 'css-loader' // translates CSS into CommonJS
					},
					{
						loader: 'sass-loader' // compiles Sass to CSS
					}
				]
			},
			{
				test: /\.svg$/,
				loader: 'svg-sprite-loader'
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			},
			{
				test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf)(\?[a-z0-9=.]+)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	output: {
		path: __dirname + '/src/dist',
		publicPath: '/',
		filename: '[name].js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(),
		new ZipPlugin({
			path: '../../../../salesforce/force-app/main/default/staticresources/',
			filename: 'FrameAgreementResource',
			extension: 'resource'
		})
	]
};

if (process.env.NODE_ENV === 'production') {
	if (process.env.ANALYZE_BUNDLE === 'true') {
		config.plugins.push(new BundleAnalyzerPlugin());
	}
}

if (process.env.NODE_ENV === 'development') {
	config.plugins.push(new HtmlWebpackPlugin({ template: 'src/local-server/index.html' }));

	// Replace the -salesforce or -graphql implementations with -mock implementations
	config.plugins.push(
		new webpack.NormalModuleReplacementPlugin(
			/(.*)-salesforce(\.*)|(.*)-graphql(\.*)/,
			function (resource) {
				const resourceToBeBundled = resource.request
					.replace(/-salesforce/, `-mock`)
					.replace(/-graphql/, `-mock`);

				if (resourceToBeBundled !== resource.request) {
					console.warn(
						`Using ${resourceToBeBundled} instead of ${resource.request} in environment: ${process.env.NODE_ENV}`
					);
				}

				resource.request = resourceToBeBundled;
			}
		)
	);

	config.devtool = 'source-map';

	const devServerConfig = {
		devServer: {
			contentBase: './dist',
			hot: true,
			port: 2020,
			open: true
		}
	};

	config = { ...config, ...devServerConfig };
}

module.exports = config;
