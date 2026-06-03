// 引入公共样式和脚本
import '@/assets/css/common.css'
import '@/assets/js/common.js'
import './index.css'
import $ from 'jquery'

console.log('首页 JS 加载成功')

// jQuery 测试
$(function () {
	$('#home-text').text('这是 jQuery 渲染的首页内容')
})
