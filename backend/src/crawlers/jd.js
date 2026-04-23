const BaseCrawler = require('./base')
const logger = require('../utils/logger')

class JDCrawler extends BaseCrawler {
  constructor() {
    super({
      name: '京东快递',
      code: 'jd'
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
        serviceType: '京东快递',
        remark: '京东物流'
      }
    } catch (error) {
      logger.error(`[${this.name}] 获取价格失败`, { error: error.message })
      throw error
    }
  }
  
  getBasePrice(sender, receiver) {
    const priceMap = {
      '浙江省-北京市': 16,
      '浙江省-上海市': 10,
      '浙江省-广东省': 16,
      '浙江省-江苏省': 10,
      '北京市-浙江省': 16,
      '北京市-上海市': 16,
      '北京市-广东省': 18,
      '上海市-北京市': 16,
      '上海市-广东省': 17,
      '广东省-北京市': 18,
      '广东省-浙江省': 16,
      '广东省-上海市': 17
    }
    
    const key = `${sender}-${receiver}`
    return priceMap[key] || 18
  }
  
  getEstimatedTime(sender, receiver) {
    const sameProvince = sender === receiver
    const nearby = ['浙江省', '江苏省', '上海市'].includes(sender) && 
                   ['浙江省', '江苏省', '上海市'].includes(receiver)
    
    if (sameProvince) return '1天'
    if (nearby) return '1-2天'
    return '2-3天'
  }
}

module.exports = new JDCrawler()
