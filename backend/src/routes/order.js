const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

// 创建订单
router.post('/create', orderController.create)

// 获取订单列表
router.get('/list', orderController.list)

// 获取订单详情
router.get('/detail/:id', orderController.detail)

// 取消订单
router.post('/cancel', orderController.cancel)

// 支付状态同步
router.post('/syncPay', orderController.syncPay)

// 接收快递100回调（订单状态变更）
router.post('/callback', orderController.callback)

// 接收快递100物流轨迹推送
router.post('/pollCallback', orderController.callback)

// 刷新订单状态（从快递100查询）
router.post('/refresh/:id', orderController.refreshStatus)

// 自动刷新所有进行中的订单（定时任务用）
router.post('/auto-refresh', orderController.autoRefresh)

module.exports = router
