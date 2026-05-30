const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/project-A/api/hello', (req, res) => {
	res.send('Hello Express CommonJS')
})

app.get('/project-A/api/user', (req, res) => {
	res.json({ name: 'test', age: 20 })
})

// 本地开发用
const port = 3000

// 只在本地运行时启动服务器
if (require.main === module) {
	app.listen(port, () => {
		console.log(`Example app listening at http://localhost:${port}`)
	})
}

module.exports = app
