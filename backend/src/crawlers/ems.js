const BaseCrawler = require('./base')
const logger = require('../utils/logger')

class EMSCrawler extends BaseCrawler {
  constructor() {
    super({
      name: '邮政EMS',
      code: 'ems'
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
        serviceType: 'EMS标准快递',
        remark: '全国覆盖'
      }
    } catch (error) {
      logger.error(`[${this.name}] 获取价格失败`, { error: error.message })
      throw error
    }
  }
  
  getBasePrice(sender, receiver) {
    const priceMap = {
      '浙江省-北京市': 20,
      '浙江省-上海市': 15,
      '浙江省-广东省': 20,
      '浙江省-江苏省': 15,
      '北京市-浙江省': 20,
      '北京市-上海市': 20,
      '北京市-广东省': 25,
      '上海市-北京市': 20,
      '上海市-广东省': 22,
      '广东省-北京市': 25,
      '广东省-浙江省': 20,
      '广东省-上海市': 22
    }
    
    const key = `${sender}-${receiver}`
    return priceMap[key] || 25
  }
  
  getEstimatedTime(sender, receiver) {
    const sameProvince = sender === receiver
    const nearby = ['浙江省', '江苏省', '上海市'].includes(sender) && 
                   ['浙江省', '江苏省', '上海市'].includes(receiver)
    
    if (sameProvince) return '1-2天'
    if (nearby) return '2-3天'
    return '3-5天'
  }
}

module.exports = new EMSCrawler()
