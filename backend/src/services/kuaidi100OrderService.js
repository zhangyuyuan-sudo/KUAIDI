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
        throw new Error('快递100配置不完整，请检查 KUaidi100_KEY 和 KUaidi100_SECRET')
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
      logger.error(`[快递100] ${method} 调用失败: ${error.message}`)
      throw error
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

    const param = {
      kuaidicom: kuaidiCom,
      recManName: recManName,
      recManMobile: recManMobile,
      recManPrintAddr: recManPrintAddr,
      sendManName: sendManName,
      sendManMobile: sendManMobile,
      sendManPrintAddr: sendManPrintAddr,
      cargo: cargo || '物品',
      weight: weight ? String(weight) : '1',
      payment: 'SHIPPER',  // 寄付
      serviceType: '标准快递'
    }

    // 可选参数 - 只在有值时才添加
    if (callBackUrl) param.callBackUrl = callBackUrl
    
    // 根据 dayType 计算实际日期
    // 快递100要求：dayType 只能是 "今天"/"明天"/"后天"（3天内）
    // pickupStartTime/pickupEndTime 格式必须是 HH:mm（如 09:00）
    if (dayType !== undefined && dayType !== null && dayType !== '') {
      const dayTypeNum = parseInt(dayType)
      
      // 将数字转换为快递100要求的中文格式
      const dayTypeMap = {
        0: '今天',
        1: '明天',
        2: '后天'
      }
      
      // 如果超过2（后天），强制改为后天（快递100只支持3天内）
      const validDayType = dayTypeNum > 2 ? 2 : dayTypeNum
      param.dayType = dayTypeMap[validDayType] || '明天'
      
      // 设置时间段（格式：HH:mm，如 09:00）
      // 快递100要求时间格式必须是 HH:mm，不能是 YYYY-MM-DD HH:mm:ss
      let startTime = pickupStartTime || '09:00'
      let endTime = pickupEndTime || '11:00'
      
      // 如果时间格式包含日期（YYYY-MM-DD HH:mm:ss），提取时间部分
      if (startTime.includes(' ')) {
        startTime = startTime.split(' ')[1].substring(0, 5)  // 提取 HH:mm
      }
      if (endTime.includes(' ')) {
        endTime = endTime.split(' ')[1].substring(0, 5)  // 提取 HH:mm
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
