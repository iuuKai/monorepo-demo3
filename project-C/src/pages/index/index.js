// 引入jQuery
import $ from 'jquery'
// 引入公共样式
import '@/common/common.scss'
// 引入当前页面样式
import './index.scss'

// jQuery 业务代码
$(function () {
	$('#msg').text('jQuery 加载成功！').css('color', '#1890ff')
})
