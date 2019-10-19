const webpack = require("webpack");
const path = require("path");
var resolve = require('resolve');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const BrotliPlugin = require('brotli-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CssCleanupPlugin = require('css-cleanup-webpack-plugin');

var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const postcssPresetEnv = require('postcss-preset-env');
var Visualizer = require('webpack-visualizer-plugin');



const isEnvDevelopment = process.argv.includes("development")
const isEnvProduction = process.argv.includes("production")
const shouldUseSourceMap = true; 


const publicPath = isEnvProduction
? "https://s3.eu-west-2.amazonaws.com/cbs-static/static/bundle/dist/"
: isEnvDevelopment && '/';

console.log("DevEnv:", isEnvDevelopment)
console.log("ProductionEnv:", isEnvProduction)



const productionSettings = {
	mode: "production",
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './build'),
		publicPath: "https://s3.eu-west-2.amazonaws.com/cbs-static/static/bundle/dist/",
		filename: 'static/js/[name].js',
		chunkFilename: 'static/js/[name].chunk.js'
	},
	resolve: {
	    alias: {
	      "styled-components": path.resolve("node_modules", "styled-components"),
	    }
	},
    optimization: {
		minimize: true,
		minimizer: [
			new BrotliPlugin({
				asset: '[path].br[query]',
				test: /\.(js|css|html|svg)$/,
				threshold: 10240,
				minRatio: 0.8
			  }),
		  // This is only used in production mode
		  new TerserPlugin({
			test: /\.js(\?.*)?$/i,
			terserOptions: {
			  parse: {
				// we want terser to parse ecma 8 code. However, we don't want it
				// to apply any minfication steps that turns valid ecma 5 code
				// into invalid ecma 5 code. This is why the 'compress' and 'output'
				// sections only apply transformations that are ecma 5 safe
				// https://github.com/facebook/create-react-app/pull/4234
				ecma: 5,
			  },
			  compress: {
				ecma: 5,
				warnings: true,
				// Disabled because of an issue with Uglify breaking seemingly valid code:
				// https://github.com/facebook/create-react-app/issues/2376
				// Pending further investigation:
				// https://github.com/mishoo/UglifyJS2/issues/2011
				comparisons: true,
				// Disabled because of an issue with Terser breaking valid code:
				// https://github.com/facebook/create-react-app/issues/5250
				// Pending futher investigation:
				// https://github.com/terser-js/terser/issues/120
				inline: 2,
			  },
			  mangle: {
				safari10: true,
			  },
			  output: {
				ecma: 5,
				comments: false,
				// Turned on because emoji and regex is not minified properly using default
				// https://github.com/facebook/create-react-app/issues/2488
				ascii_only: true,
			  },
			},
			// Use multi-process parallel running to improve the build speed
			// Default number of concurrent runs: os.cpus().length - 1
			// Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
			// https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
			parallel: 2,
			// Enable file caching
			cache: true,
			sourceMap: false,
		  }),
		  // This is only used in production mode
		  new OptimizeCSSAssetsPlugin({
			cssProcessorOptions: {
			  parser: safePostCssParser,
			  map: false //shouldUseSourceMap
				? {
					// `inline: false` forces the sourcemap to be output into a
					// separate file
					inline: false,
					// `annotation: true` appends the sourceMappingURL to the end of
					// the css file, helping the browser find the sourcemap
					annotation: true,
				  }
				: false,
			},
		  }),
		],
		// Automatically split vendor and commons
		// https://twitter.com/wSokra/status/969633336732905474
		// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
   ///
		splitChunks: {
		  chunks: 'all',
		  name: true,
		},
		// Keep the runtime chunk separated to enable long term caching
		// https://twitter.com/wSokra/status/969679223278505985
		runtimeChunk: false,
	  },
	devServer: {
		historyApiFallback: true,
		stats: 'normal',
	  },
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
				}
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader'),
				options: {
					limit: 10000,
					name: 'static/media/[name].[ext]',
				},
			},
			{
				test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
				loader: require.resolve('file-loader'),
				options: {
					name: 'static/media/[name].[ext]',
				},
			},
			{
				test: /\.css$/i,
				use: [
					//{loader: MiniCssExtractPlugin.loader, options: {
					//	  //your styles extracted in a file for production builds.
					//	  //hmr: isEnvDevelopment,
					//	},
					//  },
				  // IMPORTANT => don't forget `injectType`  option  
				  { loader: 'style-loader', options: { injectType: 'styleTag' } },
				  //"css-loader"
				  //{ loader: 'sass-loader' },
				],
			},
			{
				test: /\.css$/i,
				use: [
					{loader: MiniCssExtractPlugin.loader, options: {
						  //your styles extracted in a file for production builds.
						  hmr: false, //isEnvDevelopment,
						},
					  },
					  "css-loader",
					  { loader: 'postcss-loader', options: {
						ident: 'postcss',
						plugins: () => [
						  postcssPresetEnv({
							"browsers":[
							  "safari > 5",
							  "ie >= 11",
							  "iOS >= 9",
							  "ChromeAndroid > 50",
							  "last 20 versions"
							],
							"autoprefixer": { "grid": true }
						  })
						]
					  } }
				],
			},
		]
	},
	plugins: [
		//new BrotliPlugin({
		//	asset: '[path].br[query]',
		//	test: /\.(js|css|html|svg)$/,
		//	threshold: 10240,
		//	minRatio: 0.8
		//  }),
		new DuplicatePackageCheckerPlugin(),
		new HtmlWebPackPlugin({
			inject: true,
			template: "./src/index.html",
			filename: "./webpack-html-plugin-output.html",
			minify: {
					collapseWhitespace: true,
					removeComments: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyCSS: true,
					minifyURLs: true,
				  }
		}),
		new PreloadWebpackPlugin(),
		//new CssCleanupPlugin(),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].css',
          chunkFilename: 'static/css/[name].chunk.css',
		}),
		new Visualizer({
			filename: '../../statistics.html'
		  })
	]
};

const devSettings = {
	mode: "development",
	entry: './src/index.html',
	//entry: './src/prerendered-index.html',
    entry: {
		app: './src/index.js',
		print: './src/print.js',
	  },
	output: {
		path: path.resolve(__dirname, './build'),
		publicPath: "/",
		filename: 'static/js/bundle.js',
		chunkFilename: 'static/js/[name].chunk.js',
	},
	devtool: 'inline',
	devServer: {
		historyApiFallback: true,
		contentBase: './dist',
		stats: 'minimal',
	  },
	  resolve: {
	    alias: {
	      "styled-components": path.resolve(__dirname, "node_modules", "styled-components"),
	    }
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				include: path.resolve(__dirname, 'src'),
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: ["@babel/plugin-proposal-object-rest-spread"],
						cacheDirectory: true
					},
				}
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader'),
				options: {
					limit: 10000,
					name: 'static/media/[name].[ext]',
				},
			},
			{
				test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
				loader: require.resolve('file-loader'),
				options: {
					name: 'static/media/[name].[ext]',
				},
			},
			{
				test: /\.css$/i,
				use: [
					//{loader: MiniCssExtractPlugin.loader, options: {
					//	  //your styles extracted in a file for production builds.
					//	  //hmr: isEnvDevelopment,
					//	},
					//  },
				  // IMPORTANT => don't forget `injectType`  option  
				  { loader: 'style-loader', options: { injectType: 'styleTag' } },
				  "css-loader",
				  'postcss-loader'
				  //{ loader: 'sass-loader' },
				],
			},
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			inject: true,
			template: "./src/index.html",
			filename: "./index.html",
			minify: {
					collapseWhitespace: true,
					removeComments: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyCSS: true,
					minifyURLs: true,
				  }
		}),
	]
};



module.exports = isEnvProduction ? productionSettings : devSettings;
