const axios = require('axios')
const crypto = require('crypto')
const logger = require('../utils/logger')

class Kuaidi100OrderService {
  constructor() {
    // 沙箱环境（测试用）
    this.baseURL = process.env.KUaidi100_SANDBOX === 'true' 
      ? 'https://api.kuaidi100.com/apiMock/border' 
      : 'https://poll.kuaidi100.com/order/borderapi.do'
    this.key = process.env.KUaidi100_KEY
    this.secret = process.env.KUaidi100_SECRET
  }

  // 生成签名: MD5(param + t + key + secret)
  generateSign(param, t) {
    const paramStr = JSON.stringify(param)
    const str = `${paramStr}${t}${this.key}${this.secret}`
    return crypto.createHash('md5').update(str).digest('hex').toUpperCase()
  }

  // 调用快递100 API的通用方法
  async callApi(method, param) {
    try {
      if (!this.key || !this.secret) {
        const error = new Error('快递100配置不完整，请检查 KUaidi100_KEY 和 KUaidi100_SECRET')
        error.code = 'CONFIG_ERROR'
        throw error
      }

      const t = Date.now().toString()
      const sign = this.generateSign(param, t)

      const requestData = {
        method: method,
        key: this.key,
        sign: sign,
        t: t,
        param: JSON.stringify(param)
      }

      // 转为 form-urlencoded
      const formData = new URLSearchParams()
      for (const [k, v] of Object.entries(requestData)) {
        formData.append(k, v)
      }

      logger.info(`[快递100] ${method} 请求: ${JSON.stringify(param)}`)

      const response = await axios.post(this.baseURL, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000
      })

      logger.info(`[快递100] ${method} 响应: ${JSON.stringify(response.data)}`)

      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || '未知错误'
      logger.error(`[快递100] ${method} 调用失败: ${errorMsg}`, {
        stack: error.stack,
        response: error.response?.data
      })
      
      // 重新抛出带有更详细信息的错误
      const newError = new Error(`快递100调用失败: ${errorMsg}`)
      newError.code = error.code || 'API_ERROR'
      newError.originalError = error
      throw newError
    }
  }

  /**
   * 寄件下单
   */
  async createOrder(orderInfo) {
    const {
      kuaidiCom,        // 快递公司编码
      recManName,       // 收件人姓名
      recManMobile,     // 收件人电话
      recManPrintAddr,  // 收件人完整地址
      sendManName,      // 寄件人姓名
      sendManMobile,    // 寄件人电话
      sendManPrintAddr, // 寄件人完整地址
      cargo,            // 物品名称
      weight,           // 重量
      dayType,          // 预约日期
      pickupStartTime,  // 预约开始时间
      pickupEndTime,    // 预约结束时间
      callBackUrl,      // 回调地址
      valinsPay         // 保价金额
    } = orderInfo

    // 参数验证
    if (!kuaidiCom) {
      throw new Error('快递公司编码不能为空')
    }
    if (!recManMobile) {
      throw new Error('收件人电话不能为空')
    }
    if (!recManPrintAddr) {
      throw new Error('收件人地址不能为空')
    }
    if (!sendManMobile) {
      throw new Error('寄件人电话不能为空')
    }
    if (!sendManPrintAddr) {
      throw new Error('寄件人地址不能为空')
    }

    const param = {
      kuaidicom: kuaidiCom,
      recManName: recManName || '收件人',
      recManMobile: recManMobile,
      recManPrintAddr: recManPrintAddr,
      sendManName: sendManName || '寄件人',
      sendManMobile: sendManMobile,
      sendManPrintAddr: sendManPrintAddr,
      cargo: cargo || '物品',
      weight: weight ? String(weight) : '1',
      payment: 'SHIPPER',
      serviceType: '标准快递'
    }

    // 可选参数 - 只在有值时才添加
    if (callBackUrl) param.callBackUrl = callBackUrl
    
    // 根据 dayType 计算实际日期
    if (dayType !== undefined && dayType !== null && dayType !== '') {
      const dayTypeNum = parseInt(dayType)
      
      const dayTypeMap = {
        0: '今天',
        1: '明天',
        2: '后天'
      }
      
      const validDayType = dayTypeNum > 2 ? 2 : dayTypeNum
      param.dayType = dayTypeMap[validDayType] || '明天'
      
      let startTime = pickupStartTime || '09:00'
      let endTime = pickupEndTime || '11:00'
      
      if (startTime.includes(' ')) {
        startTime = startTime.split(' ')[1].substring(0, 5)
      }
      if (endTime.includes(' ')) {
        endTime = endTime.split(' ')[1].substring(0, 5)
      }
      
      param.pickupStartTime = startTime
      param.pickupEndTime = endTime
      
      logger.info(`[日期计算] dayType:${dayTypeNum}(${param.dayType}), 时间段:${startTime}-${endTime}`)
    }
    if (valinsPay) param.valinsPay = String(valinsPay)

    return await this.callApi('bOrder', param)
  }

  /**
   * 取消订单
   */
  async cancelOrder(taskId, orderId, cancelMsg) {
    const param = {
      taskId: taskId,
      orderId: orderId,
      cancelMsg: cancelMsg || '用户取消'
    }

    return await this.callApi('cancel', param)
  }

  /**
   * 查询订单详情
   */
  async getOrderDetail(taskId) {
    const param = {
      taskId: taskId
    }

    return await this.callApi('detail', param)
  }

  /**
   * 单快递公司查价
   */
  async queryPrice(kuaidiCom, sendAddr, recAddr, weight) {
    const param = {
      kuaidiCom: kuaidiCom,
      sendManPrintAddr: sendAddr,
      recManPrintAddr: recAddr,
      weight: weight ? String(weight) : '1'
    }

    return await this.callApi('price', param)
  }

  /**
   * 支付状态同步
   */
  async syncPayStatus(orderId) {
    const param = {
      orderId: orderId
    }

    return await this.callApi('synPay', param)
  }
}

module.exports = new Kuaidi100OrderService()
