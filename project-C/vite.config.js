import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import path from 'path'

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const isBuild = command === 'build'
	if (isBuild && !env.BASE_URL) {
		throw new Error('BASE_URL is required')
	}
	const baseURL = isBuild ? env.BASE_URL : '/'

	return {
		base: baseURL,
		plugins: [
			ViteEjsPlugin(
				{ BASE_URL: baseURL, isBuild },
				{
					ejs: {
						views: [resolve(__dirname, 'src')]
					}
				}
			)
		],
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
				'@assets': path.resolve(__dirname, 'src/assets'),
				'@css': path.resolve(__dirname, 'src/assets/css'),
				'@js': path.resolve(__dirname, 'src/assets/js'),
				'@images': path.resolve(__dirname, 'src/assets/images')
			}
		},
		build: {
			outDir: 'dist',
			assetsDir: 'static',
			rollupOptions: {
				input: {
					index: resolve(__dirname, 'src/pages/home/index.html'),
					about: resolve(__dirname, 'src/pages/about/index.html')
				}
			}
		},
		server: {
			port: 3000,
			// open: '/',
			hot: true
		},
		root: './src'
	}
})
