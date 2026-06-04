import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite' // 启用Vite打包
import { defaultTheme } from '@vuepress/theme-default'

export default defineUserConfig({
	base: process.env.BASE_URL,
	// 指定使用Vite作为打包工具（关键）
	bundler: viteBundler({
		// 自定义Vite原生配置，直接透传给Vite
		viteOptions: {
			// 原生vite.config配置，别名、插件、服务端口都可写这里
			server: { port: 8088 },
			resolve: {
				alias: { '@': './docs/.vuepress' }
			}
		}
	}),
	// 站点基础配置
	title: 'VuePress',
	description: 'VuePress文档',
	theme: defaultTheme({
		// 导航栏配置
		navbar: [
			{ text: '首页', link: '/' },
			{ text: '指南', link: '/guide/' }
		],
		// 侧边栏
		sidebar: {
			'/guide/': ['intro']
		}
	})
})
