// webpack.config.js
var webpack = require('webpack')
var path = require( 'path' );
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var assign = require('object-assign');

module.exports = function(options) {
	console.log(options)

	let isProd = options.production == 'prod'
	let isWeb = options.web == 'web'
	let outdir, filename;
	if (isWeb) {
		outdir = "dist"
		filename = 'raidajs.web.js'
	} else {
		outdir = "lib"
		filename = 'raidajs.js'
	}

	let config = {
		context: __dirname,
		entry: path.join(__dirname, "src/raidajs.js"),
		output: {
			path: path.resolve( __dirname, outdir),
			filename: filename,
		},
		resolve: {
			extensions: ['.js']
		},
		devtool: isProd ? null : '#eval-source-map',
		plugins: isProd ? [
			new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}),
			new UglifyJsPlugin({ minimize: true })
			// Prod plugins here
		] : [
			new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"development"'}})
			// Dev plugins here
		],
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: ['babel-loader', 'eslint-loader'],
				}
			]
		}
	}


	config.plugins.push(new CleanWebpackPlugin());


	if (isWeb) {
		config['target'] = 'web'
		config['output']['library'] = "raidajs"
		config['output']['libraryTarget'] = "umd"
		config['output']['umdNamedDefine'] = true

	} else {
		config['target'] = 'node'
		config['node'] = {
			__dirname: true,
			__filename: true
		}
		config['output']['library'] = "raidajs"
		config['output']['libraryTarget'] = "commonjs2"
	}	

	return config;
};
