const BaseCrawler = require('./base')
const logger = require('../utils/logger')

class SFCrawler extends BaseCrawler {
  constructor() {
    super({
      name: '顺丰速运',
      code: 'sf'
    })
  }
  
  async getPrice(params) {
    const { senderProvince, senderCity, receiverProvince, receiverCity, weight } = params
    
    try {
      const basePrice = this.getBasePrice(senderProvince, receiverProvince)
      const price = this.calculatePrice(basePrice, weight)
      
      return {
        price: parseFloat(price.toFixed(2)),
        originalPrice: parseFloat((price * 1.2).toFixed(2)),
        discount: '会员价',
        estimatedTime: this.getEstimatedTime(senderProvince, receiverProvince),
        serviceType: '顺丰标快',
        remark: ''
      }
    } catch (error) {
      logger.error(`[${this.name}] 获取价格失败`, { error: error.message })
      throw error
    }
  }
  
  getBasePrice(sender, receiver) {
    const priceMap = {
      '浙江省-北京市': 18,
      '浙江省-上海市': 12,
      '浙江省-广东省': 18,
      '浙江省-江苏省': 12,
      '北京市-浙江省': 18,
      '北京市-上海市': 18,
      '北京市-广东省': 22,
      '上海市-北京市': 18,
      '上海市-广东省': 20,
      '广东省-北京市': 22,
      '广东省-浙江省': 18,
      '广东省-上海市': 20
    }
    
    const key = `${sender}-${receiver}`
    return priceMap[key] || 23
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

module.exports = new SFCrawler()
