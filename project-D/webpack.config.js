const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ejs = require('ejs')
require('dotenv').config()

const BASE_URL = process.env.BASE_URL
// ======================================
// 自动获取多页面入口（核心功能）
// ======================================
const getPages = () => {
	const pagesDir = path.resolve(__dirname, 'src/pages')
	const files = fs.readdirSync(pagesDir)
	const entries = {}
	const htmlPlugins = []

	files.forEach(page => {
		// 页面入口JS
		entries[page] = path.resolve(pagesDir, page, 'index.js')

		// 生成HTML页面
		const templatePath = path.resolve(pagesDir, page, 'index.ejs')
		const templateContent = fs.readFileSync(templatePath, 'utf8')

		htmlPlugins.push(
			new HtmlWebpackPlugin({
				filename: `${page}.html`, // 输出：index.html / about.html
				templateContent: ejs.render(
					templateContent,
					{
						BASE_URL: BASE_URL
					},
					{
						filename: templatePath,
						views: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'src/common')]
					}
				),
				templateParameters: {
					BASE_URL: BASE_URL
				},
				chunks: [page], // 只引入当前页面JS
				minify:
					process.env.NODE_ENV === 'production'
						? {
								collapseWhitespace: true,
								removeComments: true
							}
						: false
			})
		)
	})

	return { entries, htmlPlugins }
}

const { entries, htmlPlugins } = getPages()

module.exports = {
	// 多入口
	entry: entries,

	// 输出
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[contenthash:8].js',
		assetModuleFilename: 'static/[name].[contenthash:8][ext]',
		publicPath: BASE_URL
	},

	// 模块解析
	module: {
		rules: [
			// CSS/SCSS
			{
				test: /\.(css|scss)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},

			// 静态资源（图片/字体）
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
				type: 'asset'
			}
		]
	},

	// 插件
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css'
		}),
		...htmlPlugins // 自动注入所有页面
	],

	// 开发服务器
	devServer: {
		static: path.resolve(__dirname, 'public'),
		open: true,
		hot: true,
		port: 9000,
		historyApiFallback: false
	},

	// 优化
	optimization: {
		splitChunks: {
			chunks: 'all', // 抽离公共代码（jQuery、公共库）
			name: 'common'
		}
	},

	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src') // 路径别名
		}
	},

	mode: process.env.NODE_ENV || 'development'
}
