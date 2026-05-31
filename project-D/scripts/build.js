const fs = require('fs')
const path = require('path')
require('dotenv').config()

// 配置文件
const BASE_URL = process.env.BASE_URL

// 路径
const projectRoot = path.resolve(__dirname, '..')
const srcDir = path.resolve(projectRoot, 'src')
const outDir = path.resolve(projectRoot, 'dist')

// 目录配置（方便扩展，只需修改这里）
const dirs = ['pages', 'views', 'assets']

// 1. 先清空 dist 目录
if (fs.existsSync(outDir)) {
	fs.rmSync(outDir, { recursive: true, force: true })
}

// 2. 把整个 src 复制到 dist
fs.cpSync(srcDir, outDir, { recursive: true, force: true })

// 3. 递归替换所有 HTML、JS 文件里的路径
function replaceAllFiles(dir) {
	const files = fs.readdirSync(dir, { withFileTypes: true })

	files.forEach(item => {
		const fullPath = path.join(dir, item.name)

		// 是文件夹 → 递归
		if (item.isDirectory()) {
			replaceAllFiles(fullPath)
			return
		}

		// 只处理 HTML / JS / CSS
		const isHtml = item.name.endsWith('.html')
		const isJs = item.name.endsWith('.js')
		const isCss = item.name.endsWith('.css')
		if (!isHtml && !isJs && !isCss) return

		let content = fs.readFileSync(fullPath, 'utf8')

		// ==============================================
		// 🔥 全覆盖替换规则（仅处理配置的目录开头的路径）
		// ==============================================

		// 生成目录匹配模式
		const dirsPattern = dirs.join('|')
		const slash = '/'

		// 1. HTML 属性：href="/xxx"  src="/xxx"
		content = content.replace(
			new RegExp(`(href|src)="${slash}(${dirsPattern})${slash}([^"#]+)"`, 'g'),
			(_, attr, type, rest) => `${attr}="${BASE_URL}${type}/${rest}"`
		)

		// 2. data-* 自定义属性中的 URL
		content = content.replace(
			new RegExp(`(data-[a-zA-Z0-9-]+)="${slash}(${dirsPattern})${slash}([^"#]+)"`, 'g'),
			(_, attr, type, rest) => `${attr}="${BASE_URL}${type}/${rest}"`
		)

		// 3. JS 中的路径：location.href = '/xxx'
		content = content.replace(
			new RegExp(`location\\.href\\s*=\\s*['"]${slash}(${dirsPattern})${slash}([^'"]+)['"]`, 'g'),
			(_, type, url) => `location.href = "${BASE_URL}${type}/${url}"`
		)

		// 4. window.open('/xxx')
		content = content.replace(
			new RegExp(`window\\.open\\(\\s*['"]${slash}(${dirsPattern})${slash}([^'"]+)['"]`, 'g'),
			(_, type, url) => `window.open("${BASE_URL}${type}/${url}")`
		)

		// 5. location.assign('/xxx')
		content = content.replace(
			new RegExp(`location\\.assign\\(\\s*['"]${slash}(${dirsPattern})${slash}([^'"]+)['"]`, 'g'),
			(_, type, url) => `location.assign("${BASE_URL}${type}/${url}")`
		)

		// 6. location.replace('/xxx')
		content = content.replace(
			new RegExp(`location\\.replace\\(\\s*['"]${slash}(${dirsPattern})${slash}([^'"]+)['"]`, 'g'),
			(_, type, url) => `location.replace("${BASE_URL}${type}/${url}")`
		)

		// 7. pjax 配置 url: '/xxx'
		content = content.replace(
			new RegExp(`(url:\\s*['"])${slash}(${dirsPattern})${slash}([^'"]+)(['"])`, 'g'),
			(_, prefix, type, url, suffix) => `${prefix}${BASE_URL}${type}/${url}${suffix}`
		)

		// 8. JS 文件中的字符串路径（单引号）
		content = content.replace(
			new RegExp(`'${slash}(${dirsPattern})${slash}([^']+)'`, 'g'),
			(_, type, url) => `'${BASE_URL}${type}/${url}'`
		)

		// 9. JS 文件中的字符串路径（双引号）
		content = content.replace(
			new RegExp(`"${slash}(${dirsPattern})${slash}([^"]+)"`, 'g'),
			(_, type, url) => `"${BASE_URL}${type}/${url}"`
		)

		// 10. JS 文件中的模板字符串（反引号）- 单独处理避免转义问题
		content = content.replace(/\/`\/([\w]+)\/([^`]+)`/g, (_, slash, type, url) => {
			if (dirs.includes(type)) {
				return `\`${BASE_URL}${type}/${url}\``
			}
			return _
		})

		// 11. CSS 中的 url() 路径：url('/xxx')
		if (isCss) {
			// 处理 url('/xxx') 或 url("/xxx")
			content = content.replace(
				new RegExp(`url\\(\\s*['"]${slash}(${dirsPattern})${slash}([^'"]+)['"]\\s*\\)`, 'g'),
				(_, type, url) => `url("${BASE_URL}${type}/${url}")`
			)
			// 处理 url(/xxx) 不带引号的情况
			content = content.replace(
				new RegExp(`url\\(\\s*${slash}(${dirsPattern})${slash}([^'"\\s)]+)\\s*\\)`, 'g'),
				(_, type, url) => `url("${BASE_URL}${type}/${url}")`
			)
		}

		// 写回文件
		fs.writeFileSync(fullPath, content, 'utf8')
	})
}

// 执行替换
replaceAllFiles(outDir)

console.log('✅ 原生项目打包完成！所有路径已替换：' + BASE_URL)
