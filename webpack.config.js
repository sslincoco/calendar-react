var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	
	entry: './calendar.js',
	output: {
		path: '/',
		publicPath:'http://127.0.0.1:3333/bin',
		filename: 'index.js' //  bundle file
	},
	devServer: {
		port: 3333,
		inline: true,	
		historyApiFallback: true
	},
	module: {
		loaders: [
		  {
			test: /\.js/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'react']
			}
		  },
		  {
            test: /\.css$/,
            loader: "style-loader!css-loader"
          }
         ]
	},
	// plugins:[
	// 	new webpack.HotModuleReplacementPlugin() 
	// ]

}