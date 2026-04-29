const orderService = require('../services/orderService')
const kuaidi100OrderService = require('../services/kuaidi100OrderService')
const logger = require('../utils/logger')
const config = require('../config')

// 回调地址基础URL（从环境变量或配置获取）
// 注意：本地localhost地址快递100无法访问，生产环境需要配置外网可访问的URL
const getCallbackBaseUrl = () => {
  return process.env.APP_BASE_URL || null
}

// 判断是否可以使用回调
const canUseCallback = () => {
  const baseUrl = process.env.APP_BASE_URL
  // 如果没有配置，或者是localhost，都不使用回调
  return baseUrl && !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1')
}

class OrderController {
  // 创建订单
  async create(req, res, next) {
    try {
      const {
        courierCode,
        courierName,
        price,
        senderName,
        senderMobile,
        senderAddress,
        receiverName,
        receiverMobile,
        receiverAddress,
        cargo,
        weight,
        dayType,
        pickupStartTime,
        pickupEndTime,
        valinsPay
      } = req.body

      logger.info('创建订单请求', { courierCode, receiverName })

      // 构建快递100下单参数
      const kuaidiComMap = {
        'sf': 'shunfeng',
        'zt': 'zhongtong',
        'yt': 'yuantong',
        'yd': 'yunda',
        'st': 'shentong',
        'jt': 'jtexpress',
        'ems': 'ems',
        'db': 'debangkuaidi',
        'jd': 'jd'
      }

      const kuaidiCom = kuaidiComMap[courierCode]
      if (!kuaidiCom) {
        return res.status(400).json({
          code: 400,
          message: `不支持的快递公司: ${courierCode}`,
          data: null
        })
      }

      // 先创建平台订单
      const platformOrder = await orderService.createOrder({
        courierCode,
        courierName: courierName || courierCode,
        price,
        senderName,
        senderMobile,
        senderAddress,
        receiverName,
        receiverMobile,
        receiverAddress,
        cargo: cargo || '物品',
        weight,
        dayType,
        pickupStartTime,
        pickupEndTime,
        valinsPay
      })

      // 调用快递100下单
      // 只有在配置了外网可访问的回调地址时才传递
      const callbackUrl = canUseCallback() ? `${getCallbackBaseUrl()}/api/order/callback` : null
      
      const orderParams = {
        kuaidiCom,
        recManName: receiverName || '收件人',
        recManMobile: receiverMobile,
        recManPrintAddr: receiverAddress,
        sendManName: senderName || 'esimfan',
        sendManMobile: senderMobile,
        sendManPrintAddr: senderAddress,
        cargo: cargo || '物品',
        weight,
        dayType,
        pickupStartTime,
        pickupEndTime,
        valinsPay
      }
      
      // 只有有有效的回调地址才传递
      if (callbackUrl) {
        orderParams.callBackUrl = callbackUrl
      }
      
      const kuaidi100Result = await kuaidi100OrderService.createOrder(orderParams)

      // 更新平台订单的快递100信息
      if (kuaidi100Result.result) {
        await orderService.updateOrderStatus(platformOrder.id, 0, {
          taskId: kuaidi100Result.data?.taskId,
          orderId: kuaidi100Result.data?.orderId,
          kuaidiNum: kuaidi100Result.data?.kuaidinum,
          pollToken: kuaidi100Result.data?.pollToken,
          kuaidi100Response: kuaidi100Result
        })

        res.json({
          code: 200,
          message: '下单成功',
          data: {
            orderId: platformOrder.id,
            taskId: kuaidi100Result.data?.taskId,
            kuaidiNum: kuaidi100Result.data?.kuaidinum,
            status: 0,
            statusText: '已下单'
          }
        })
      } else {
        // 快递100下单失败，标记订单为失败
        await orderService.updateOrderStatus(platformOrder.id, 610, {
          kuaidi100Response: kuaidi100Result,
          failReason: kuaidi100Result.message || '下单失败'
        })

        res.status(400).json({
          code: 400,
          message: kuaidi100Result.message || '快递100下单失败',
          data: {
            orderId: platformOrder.id,
            failReason: kuaidi100Result.message
          }
        })
      }
    } catch (error) {
      const errorMsg = error.message || '未知错误'
      const errorStack = error.stack || ''
      logger.error('创建订单失败', { 
        error: errorMsg, 
        stack: errorStack,
        body: req.body 
      })
      
      // 返回更详细的错误信息
      const err = new Error(errorMsg)
      err.statusCode = 500
      next(err)
    }
  }

  // 获取订单列表
  async list(req, res, next) {
    try {
      const orders = await orderService.getAllOrders()
      res.json({
        code: 200,
        message: 'success',
        data: orders
      })
    } catch (error) {
      logger.error('获取订单列表失败', { error: error.message })
      next(error)
    }
  }

  // 获取订单详情
  async detail(req, res, next) {
    try {
      const { id } = req.params
      const order = await orderService.getOrder(id)

      if (!order) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在',
          data: null
        })
      }

      res.json({
        code: 200,
        message: 'success',
        data: order
      })
    } catch (error) {
      logger.error('获取订单详情失败', { error: error.message })
      next(error)
    }
  }

  // 取消订单
  async cancel(req, res, next) {
    try {
      const { orderId, cancelMsg } = req.body
      const order = await orderService.getOrder(orderId)

      if (!order) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在',
          data: null
        })
      }

      // 只有未取件的订单可以取消
      if (order.status >= 10) {
        return res.status(400).json({
          code: 400,
          message: '订单已取件，无法取消',
          data: null
        })
      }

      // 调用快递100取消接口
      if (order.taskId && order.orderId) {
        try {
          await kuaidi100OrderService.cancelOrder(order.taskId, order.orderId, cancelMsg)
        } catch (err) {
          logger.warn(`快递100取消订单失败: ${err.message}`)
        }
      }

      // 更新本地订单状态
      await orderService.cancelOrder(orderId, cancelMsg)

      res.json({
        code: 200,
        message: '取消成功',
        data: { orderId }
      })
    } catch (error) {
      logger.error('取消订单失败', { error: error.message })
      next(error)
    }
  }

  // 接收快递100回调
  async callback(req, res, next) {
    try {
      const { param, sign } = req.body
      logger.info('收到快递100回调', { param, sign })

      if (!param) {
        return res.json({ result: true, returnCode: '200', message: '成功' })
      }

      let callbackData
      try {
        callbackData = JSON.parse(param)
      } catch (e) {
        logger.error('回调参数解析失败', { param })
        return res.json({ result: true, returnCode: '200', message: '成功' })
      }

      const { orderId, status, message: statusMsg, data } = callbackData

      logger.info('回调数据解析', { orderId, status, statusMsg })

      // 查找对应的平台订单
      const orders = await orderService.getAllOrders()
      const platformOrder = orders.find(o => o.orderId === orderId || o.taskId === callbackData.taskId)

      if (platformOrder) {
        const extraData = {}
        if (data) {
          if (data.courierName) extraData.courierName_real = data.courierName
          if (data.courierMobile) extraData.courierMobile = data.courierMobile
          if (data.weight) extraData.actualWeight = data.weight
          if (data.freight) extraData.actualPrice = data.freight
          if (data.kuaidinum) extraData.kuaidiNum = data.kuaidinum
        }

        await orderService.updateOrderStatus(platformOrder.id, parseInt(status), extraData)
      }

      // 必须返回成功响应，否则快递100会重试
      res.json({
        result: true,
        returnCode: '200',
        message: '成功'
      })
    } catch (error) {
      logger.error('处理回调失败', { error: error.message })
      // 即使出错也要返回成功，避免快递100重试
      res.json({
        result: true,
        returnCode: '200',
        message: '成功'
      })
    }
  }

  // 支付状态同步
  async syncPay(req, res, next) {
    try {
      const { orderId } = req.body
      const order = await orderService.getOrder(orderId)

      if (!order) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在',
          data: null
        })
      }

      if (!order.orderId) {
        return res.status(400).json({
          code: 400,
          message: '订单未同步到快递100',
          data: null
        })
      }

      const result = await kuaidi100OrderService.syncPayStatus(order.orderId)

      if (result.result) {
        await orderService.updatePayStatus(orderId, 1)
        res.json({
          code: 200,
          message: '支付同步成功',
          data: { orderId }
        })
      } else {
        res.status(400).json({
          code: 400,
          message: result.message || '支付同步失败',
          data: null
        })
      }
    } catch (error) {
      logger.error('支付同步失败', { error: error.message })
      next(error)
    }
  }

  // 刷新订单状态（从快递100查询最新状态）
  async refreshStatus(req, res, next) {
    try {
      const { id } = req.params
      const order = await orderService.getOrder(id)

      if (!order) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在',
          data: null
        })
      }

      if (!order.taskId) {
        return res.status(400).json({
          code: 400,
          message: '订单未同步到快递100，无法查询状态',
          data: null
        })
      }

      // 调用快递100查询订单详情
      const result = await kuaidi100OrderService.getOrderDetail(order.taskId)
      logger.info(`刷新订单状态 [${id}]:`, result)

      if (result.result && result.data) {
        const data = result.data
        
        // 更新本地订单状态
        const extraData = {}
        if (data.status !== undefined) {
          extraData.status = parseInt(data.status)
        }
        if (data.kuaidinum) extraData.kuaidiNum = data.kuaidinum
        if (data.courierName) extraData.courierName_real = data.courierName
        if (data.courierMobile) extraData.courierMobile = data.courierMobile
        if (data.weight) extraData.actualWeight = data.weight
        if (data.freight) extraData.actualPrice = data.freight
        if (data.message) extraData.statusMessage = data.message

        await orderService.updateOrderStatus(order.id, extraData.status || order.status, extraData)

        res.json({
          code: 200,
          message: '刷新成功',
          data: {
            orderId: order.id,
            status: extraData.status || order.status,
            kuaidiNum: extraData.kuaidiNum || order.kuaidiNum,
            courierInfo: {
              name: extraData.courierName_real,
              mobile: extraData.courierMobile
            },
            rawData: data
          }
        })
      } else {
        res.status(400).json({
          code: 400,
          message: result.message || '查询快递100失败',
          data: null
        })
      }
    } catch (error) {
      logger.error('刷新订单状态失败', { error: error.message })
      next(error)
    }
  }

  // 自动刷新所有进行中的订单（定时任务用）
  async autoRefresh(req, res, next) {
    try {
      logger.info('开始自动刷新订单状态')
      const orders = await orderService.getAllOrders()
      
      // 只刷新未完成的订单（status < 13）
      const pendingOrders = orders.filter(o => o.status < 13 && o.taskId)
      
      let successCount = 0
      let failCount = 0
      
      for (const order of pendingOrders) {
        try {
          const result = await kuaidi100OrderService.getOrderDetail(order.taskId)
          
          if (result.result && result.data) {
            const data = result.data
            const extraData = {}
            
            if (data.status !== undefined) {
              extraData.status = parseInt(data.status)
            }
            if (data.kuaidinum) extraData.kuaidiNum = data.kuaidinum
            if (data.courierName) extraData.courierName_real = data.courierName
            if (data.courierMobile) extraData.courierMobile = data.courierMobile
            if (data.weight) extraData.actualWeight = data.weight
            if (data.freight) extraData.actualPrice = data.freight
            
            await orderService.updateOrderStatus(order.id, extraData.status || order.status, extraData)
            successCount++
          } else {
            failCount++
          }
          
          // 延迟500ms，避免请求过快
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (err) {
          logger.warn(`自动刷新订单失败 [${order.id}]: ${err.message}`)
          failCount++
        }
      }
      
      logger.info(`自动刷新完成，成功: ${successCount}, 失败: ${failCount}`)
      
      if (res) {
        res.json({
          code: 200,
          message: '自动刷新完成',
          data: {
            total: pendingOrders.length,
            success: successCount,
            fail: failCount
          }
        })
      }
    } catch (error) {
      logger.error('自动刷新订单失败', { error: error.message })
      if (next) next(error)
    }
  }
}

module.exports = new OrderController()
