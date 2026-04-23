const BaseCrawler = require('./base')
const logger = require('../utils/logger')

class YDCrawler extends BaseCrawler {
  constructor() {
    super({
      name: '韵达快递',
      code: 'yd'
    })
  }
  
  async getPrice(params) {
    const { senderProvince, senderCity, receiverProvince, receiverCity, weight } = params
    
    try {
      const basePrice = this.getBasePrice(senderProvince, receiverProvince)
      const price = this.calculatePrice(basePrice, weight)
      
      return {
        price: parseFloat(price.toFixed(2)),
        originalPrice: parseFloat(price.toFixed(2)),
        discount: '',
        estimatedTime: this.getEstimatedTime(senderProvince, receiverProvince),
        serviceType: '标准快递',
        remark: ''
      }
    } catch (error) {
      logger.error(`[${this.name}] 获取价格失败`, { error: error.message })
      throw error
    }
  }
  
  getBasePrice(sender, receiver) {
    const priceMap = {
      '浙江省-北京市': 12,
      '浙江省-上海市': 8,
      '浙江省-广东省': 12,
      '浙江省-江苏省': 8,
      '北京市-浙江省': 12,
      '北京市-上海市': 12,
      '北京市-广东省': 15,
      '上海市-北京市': 12,
      '上海市-广东省': 13,
      '广东省-北京市': 15,
      '广东省-浙江省': 12,
      '广东省-上海市': 13
    }
    
    const key = `${sender}-${receiver}`
    return priceMap[key] || 15
  }
  
  getEstimatedTime(sender, receiver) {
    const sameProvince = sender === receiver
    const nearby = ['浙江省', '江苏省', '上海市'].includes(sender) && 
                   ['浙江省', '江苏省', '上海市'].includes(receiver)
    
    if (sameProvince) return '1-2天'
    if (nearby) return '1-2天'
    return '2-3天'
  }
}

module.exports = new YDCrawler()
