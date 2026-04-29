const logger = require('../utils/logger')

// 内存存储订单
const orders = []

class OrderService {
  constructor() {
    logger.info('订单服务初始化（内存模式）')
  }

  // 生成平台订单号
  generateOrderId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(1000 + Math.random() * 9000)
    return `KD${date}${random}`
  }

  // 创建订单
  async createOrder(orderData) {
    const orderId = this.generateOrderId()
    const now = new Date().toISOString()
    
    const order = {
      id: orderId,
      ...orderData,
      status: 0,
      statusText: '已下单',
      payStatus: 0,
      payStatusText: '未支付',
      createdAt: now,
      updatedAt: now
    }

    orders.push(order)
    logger.info(`订单创建成功: ${orderId}`)
    return order
  }

  // 根据ID获取订单
  async getOrder(orderId) {
    return orders.find(o => o.id === orderId) || null
  }

  // 获取所有订单
  async getAllOrders() {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // 更新订单状态
  async updateOrderStatus(orderId, status, extraData = {}) {
    const statusMap = {
      0: '已下单',
      1: '已接单',
      2: '收件中',
      10: '已取件',
      15: '已结算',
      13: '已签收',
      9: '已取消',
      99: '已取消',
      610: '下单失败'
    }

    const statusText = statusMap[status] || '未知状态'
    const now = new Date().toISOString()

    const order = orders.find(o => o.id === orderId)
    if (!order) {
      throw new Error(`订单不存在: ${orderId}`)
    }

    order.status = status
    order.statusText = statusText
    order.updatedAt = now

    // 更新额外字段
    if (extraData.taskId) order.taskId = extraData.taskId
    if (extraData.orderId) order.orderId = extraData.orderId
    if (extraData.kuaidiNum) order.kuaidiNum = extraData.kuaidiNum
    if (extraData.pollToken) order.pollToken = extraData.pollToken
    if (extraData.courierName_real) order.courierName_real = extraData.courierName_real
    if (extraData.courierMobile) order.courierMobile = extraData.courierMobile
    if (extraData.actualWeight) order.actualWeight = extraData.actualWeight
    if (extraData.actualPrice) order.actualPrice = extraData.actualPrice
    if (extraData.failReason) order.failReason = extraData.failReason
    if (extraData.kuaidi100Response) order.kuaidi100Response = extraData.kuaidi100Response

    logger.info(`订单状态更新: ${orderId} -> ${statusText}`)
    return { orderId, status, statusText }
  }

  // 更新支付状态
  async updatePayStatus(orderId, payStatus) {
    const payStatusMap = {
      0: '未支付',
      1: '已支付',
      3: '退款中',
      4: '已退款'
    }

    const payStatusText = payStatusMap[payStatus] || '未知'
    const now = new Date().toISOString()

    const order = orders.find(o => o.id === orderId)
    if (!order) {
      throw new Error(`订单不存在: ${orderId}`)
    }

    order.payStatus = payStatus
    order.payStatusText = payStatusText
    order.updatedAt = now

    logger.info(`订单支付状态更新: ${orderId} -> ${payStatusText}`)
    return { orderId, payStatus, payStatusText }
  }

  // 取消订单
  async cancelOrder(orderId, cancelMsg = '') {
    const now = new Date().toISOString()
    
    const order = orders.find(o => o.id === orderId)
    if (!order) {
      throw new Error(`订单不存在: ${orderId}`)
    }

    order.status = 9
    order.statusText = '已取消'
    order.cancelMsg = cancelMsg
    order.updatedAt = now

    logger.info(`订单取消: ${orderId}, 原因: ${cancelMsg}`)
    return { orderId, status: 9, statusText: '已取消' }
  }
}

module.exports = new OrderService()
