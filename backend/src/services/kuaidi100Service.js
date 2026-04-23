const axios = require('axios')
const logger = require('../utils/logger')
const config = require('../config')
const crypto = require('crypto')

class Kuaidi100Service {
  constructor() {
    this.key = process.env.KUaidi100_KEY
    this.secret = process.env.KUaidi100_SECRET
    this.userId = process.env.KUaidi100_USERID
    
    // 商家寄件接口地址
    this.borderBaseURL = 'https://poll.kuaidi100.com'
  }

  /**
   * 生成签名 (param + t + key + secret)
   */
  generateSign(param, t) {
    const paramStr = typeof param === 'string' ? param : JSON.stringify(param)
    const signStr = paramStr + t + this.key + this.secret
    return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase()
  }

  /**
   * 批量获取所有快递公司的价格
   */
  async getPrices(params) {
    const supportedCouriers = ['sf', 'zt', 'yt', 'yd', 'st', 'ems', 'db', 'jd']
    const promises = supportedCouriers.map(code => 
      this.getPrice({ ...params, courierCode: code }).catch(err => {
        logger.warn(`[快递100] 获取 ${code} 价格失败: ${err.message}`)
        return null
      })
    )
    
    const results = await Promise.all(promises)
    return results.filter(r => r !== null)
  }

  /**
   * 获取单个快递价格（使用商家寄件价格查询接口）
   * 接口地址: https://poll.kuaidi100.com/order/borderapi.do
   * 文档: https://api.kuaidi100.com/document/603cb649a62a19500e19866b
   * method: price - 查询商家寄件折扣价格（与官网一致）
   */
  async getPrice(params) {
    const { 
      senderProvince, senderCity, senderDistrict,
      receiverProvince, receiverCity, receiverDistrict,
      weight, courierCode
    } = params
    
    try {
      if (!this.key || !this.secret) {
        throw new Error('快递100配置不完整，请检查 KUaidi100_KEY 和 KUaidi100_SECRET')
      }

      const codeMap = {
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

      const kuaidi100Code = codeMap[courierCode]
      if (!kuaidi100Code) {
        throw new Error(`不支持的快递公司: ${courierCode}`)
      }

      // 构建详细地址
      const sendManPrintAddr = `${senderProvince}${senderCity}${senderDistrict || ''}`
      const recManPrintAddr = `${receiverProvince}${receiverCity}${receiverDistrict || ''}`

      // 使用商家寄件价格查询接口
      const param = {
        kuaidicom: kuaidi100Code,
        sendManPrintAddr: sendManPrintAddr,
        recManPrintAddr: recManPrintAddr,
        weight: weight.toString()
      }

      const t = Date.now().toString()
      const sign = this.generateSign(param, t)

      const requestData = {
        method: 'price',
        key: this.key,
        sign: sign,
        t: t,
        param: JSON.stringify(param)
      }

      // 商家寄件接口地址
      const apiUrl = `${this.borderBaseURL}/order/borderapi.do`

      logger.info(`[快递100] 商家寄件价格查询请求 [${courierCode}]: ${JSON.stringify(param)}`)

      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: [(data) => {
          const params = new URLSearchParams()
          for (const key in data) params.append(key, data[key])
          return params.toString()
        }],
        timeout: 15000
      })

      logger.info(`[快递100] 商家寄件价格查询响应 [${courierCode}]: ${JSON.stringify(response.data)}`)

      if (response.data && response.data.result === true) {
        return this.formatBorderPriceResponse(response.data, courierCode, param)
      } else {
        const errorMsg = response.data?.message || response.data?.returnCode || '查询失败'
        throw new Error(`快递100返回错误: ${errorMsg}`)
      }
    } catch (error) {
      logger.error(`[快递100] 获取 ${courierCode} 价格失败: ${error.message}`)
      throw error
    }
  }

  /**
   * 商家寄件下单接口
   * 接口地址: https://poll.kuaidi100.com/order/borderapi.do
   * 文档: https://api.kuaidi100.com/document/603cb649a62a19500e19866b
   */
  async createOrder(params) {
    const {
      courierCode,
      senderName, senderMobile, senderProvince, senderCity, senderDistrict, senderDetail,
      receiverName, receiverMobile, receiverProvince, receiverCity, receiverDistrict, receiverDetail,
      weight, cargo = '电子产品',
      callBackUrl = '',
      dayType = '今天',
      pickupStartTime = '09:00',
      pickupEndTime = '10:00',
      remark = ''
    } = params

    try {
      if (!this.key || !this.secret) {
        throw new Error('快递100配置不完整')
      }

      const codeMap = {
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

      const kuaidi100Code = codeMap[courierCode]
      if (!kuaidi100Code) {
        throw new Error(`不支持的快递公司: ${courierCode}`)
      }

      // 构建完整地址
      const sendManPrintAddr = `${senderProvince}${senderCity}${senderDistrict || ''}${senderDetail || ''}`
      const recManPrintAddr = `${receiverProvince}${receiverCity}${receiverDistrict || ''}${receiverDetail || ''}`

      // 构建param参数（根据文档规范）
      const param = {
        kuaidicom: kuaidi100Code,
        recManName: receiverName,
        recManMobile: receiverMobile,
        recManPrintAddr: recManPrintAddr,
        sendManName: senderName,
        sendManMobile: senderMobile,
        sendManPrintAddr: sendManPrintAddr,
        cargo: cargo,
        weight: weight.toString(),
        dayType: dayType,
        pickupStartTime: pickupStartTime,
        pickupEndTime: pickupEndTime,
        remark: remark
      }

      // 可选参数
      if (callBackUrl) param.callBackUrl = callBackUrl

      const t = Date.now().toString()
      const sign = this.generateSign(param, t)

      const requestData = {
        method: 'bOrder',
        key: this.key,
        sign: sign,
        t: t,
        param: JSON.stringify(param)
      }

      const apiUrl = `${this.borderBaseURL}/order/borderapi.do`

      logger.info(`[快递100] 商家寄件下单请求 [${courierCode}]: ${JSON.stringify(requestData)}`)

      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: [(data) => {
          const params = new URLSearchParams()
          for (const key in data) params.append(key, data[key])
          return params.toString()
        }],
        timeout: 30000
      })

      logger.info(`[快递100] 商家寄件下单响应 [${courierCode}]: ${JSON.stringify(response.data)}`)

      if (response.data && response.data.result === true) {
        return {
          success: true,
          orderId: response.data.data?.orderId,
          taskId: response.data.data?.taskId,
          kuaidiNum: response.data.data?.kuaidinum,
          message: response.data.message,
          data: response.data.data
        }
      } else {
        const errorMsg = response.data?.message || response.data?.returnCode || '下单失败'
        throw new Error(`快递100返回错误: ${errorMsg}`)
      }
    } catch (error) {
      logger.error(`[快递100] 下单失败 [${courierCode}]: ${error.message}`)
      throw error
    }
  }

  /**
   * 格式化商家寄件价格查询响应
   * 商家寄件接口返回格式与价格预估接口不同
   */
  formatBorderPriceResponse(data, courierCode, queryParam) {
    const courierMap = {
      'sf': { name: '顺丰速运', logo: 'SF', color: '#DC1E32' },
      'zt': { name: '中通快递', logo: 'ZT', color: '#0066CC' },
      'yt': { name: '圆通速递', logo: 'YT', color: '#FF6600' },
      'yd': { name: '韵达快递', logo: 'YD', color: '#009900' },
      'st': { name: '申通快递', logo: 'ST', color: '#9900FF' },
      'jt': { name: '极兔速递', logo: 'JT', color: '#FF3366' },
      'ems': { name: 'EMS', logo: 'EMS', color: '#0066CC' },
      'db': { name: '德邦快递', logo: 'DB', color: '#0066CC' },
      'jd': { name: '京东快递', logo: 'JD', color: '#DC143C' }
    }

    const courier = courierMap[courierCode]
    if (!courier) {
      throw new Error(`未知的快递公司代码: ${courierCode}`)
    }

    let price = 0
    let originalPrice = 0
    let serviceType = '商家寄件'
    
    // 商家寄件接口返回格式: data.data 包含价格信息
    // 根据快递100工作人员提示：折后价格是 price 字段
    if (data && data.data) {
      const priceData = data.data
      
      // 折后价格取 price 字段（不要取 defprice）
      price = parseFloat(priceData.price) || 
              parseFloat(priceData.totalPrice) || 
              parseFloat(priceData.freight) || 0
      
      // 原价取 standPrice 或 originalPrice
      originalPrice = parseFloat(priceData.standPrice) || 
                      parseFloat(priceData.originalPrice) || 0
      
      serviceType = priceData.productName || priceData.productType || '商家寄件'
    }
    
    if (price === 0) {
      // 如果没有获取到折扣价，记录详细日志以便调试
      logger.warn(`[快递100] ${courierCode} 未返回有效折扣价，响应数据: ${JSON.stringify(data)}`)
      throw new Error('快递100未返回有效价格')
    }

    return {
      courierCode,
      courierName: courier.name,
      courierLogo: courier.logo,
      courierColor: courier.color,
      price: price,
      originalPrice: originalPrice > price ? originalPrice : Math.round(price * 1.2 * 100) / 100,
      discount: '商家寄件折扣价',
      estimatedTime: '2-3天',
      serviceType: serviceType,
      remark: '数据来自快递100商家寄件',
      dataSource: 'kuaidi100',
      isLowest: false
    }
  }

  /**
   * 格式化价格查询响应（保留原方法用于兼容）
   */
  formatPriceResponse(data, courierCode, queryParam) {
    return this.formatBorderPriceResponse(data, courierCode, queryParam)
  }

  /**
   * 检查是否可用
   */
  isAvailable() {
    return !!(this.key && this.secret)
  }
}

module.exports = new Kuaidi100Service()
