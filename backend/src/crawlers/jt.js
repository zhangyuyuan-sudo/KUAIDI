const BaseCrawler = require('./base')
const logger = require('../utils/logger')

class JTCrawler extends BaseCrawler {
  constructor() {
    super({
      name: '极兔速递',
      code: 'jt'
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
      '浙江省-北京市': 10,
      '浙江省-上海市': 6,
      '浙江省-广东省': 10,
      '浙江省-江苏省': 6,
      '北京市-浙江省': 10,
      '北京市-上海市': 10,
      '北京市-广东省': 13,
      '上海市-北京市': 10,
      '上海市-广东省': 11,
      '广东省-北京市': 13,
      '广东省-浙江省': 10,
      '广东省-上海市': 11
    }
    
    const key = `${sender}-${receiver}`
    return priceMap[key] || 12
  }
  
  getEstimatedTime(sender, receiver) {
    const sameProvince = sender === receiver
    const nearby = ['浙江省', '江苏省', '上海市'].includes(sender) && 
                   ['浙江省', '江苏省', '上海市'].includes(receiver)
    
    if (sameProvince) return '1-2天'
    if (nearby) return '1-2天'
    return '2-4天'
  }
}

module.exports = new JTCrawler()
