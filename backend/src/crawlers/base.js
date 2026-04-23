class BaseCrawler {
  constructor(config) {
    this.config = config
    this.name = config.name
    this.code = config.code
  }
  
  async getPrice(params) {
    throw new Error('子类必须实现 getPrice 方法')
  }
  
  formatResult(data) {
    return {
      price: 0,
      originalPrice: 0,
      discount: '',
      estimatedTime: '',
      serviceType: '',
      remark: ''
    }
  }
  
  handleError(error) {
    console.error(`[${this.name}] 爬取失败:`, error.message)
    return null
  }
  
  calculatePrice(basePrice, weight, firstWeight = 1, additionalWeight = 1) {
    if (weight <= firstWeight) {
      return basePrice
    }
    const additional = Math.ceil((weight - firstWeight) / additionalWeight)
    return basePrice + additional * (basePrice * 0.5)
  }
}

module.exports = BaseCrawler
