const crawlers = require('../crawlers')
const cacheService = require('./cacheService')
const logger = require('../utils/logger')
const COURIER_CONFIG = require('../config/courier')
const kuaidi100Service = require('./kuaidi100Service')

class CourierService {
  constructor() {
    this.crawlers = crawlers
    this.dataSource = process.env.DATA_SOURCE || 'mock'
  }

  async comparePrices(params) {
    const {
      senderProvince, senderCity, senderDistrict, senderDetail,
      receiverProvince, receiverCity, receiverDistrict, receiverDetail,
      receiverName, receiverPhone,
      weight, dataSource
    } = params

    // 使用传入的数据源或默认配置
    const source = dataSource || this.dataSource

    const queryId = this.generateQueryId()
    const queryTime = new Date().toISOString()

    const cacheKey = this.getCacheKey({ ...params, dataSource: source })
    const cached = cacheService.get(cacheKey)

    if (cached) {
      logger.info('使用缓存数据', { queryId, cacheKey, dataSource: source })
      return {
        queryId,
        queryTime,
        dataSource: source,
        ...cached,
        fromCache: true
      }
    }

    let results = []

    if (source === 'kuaidi100') {
      // 使用快递100
      results = await this.fetchFromKuaidi100(params)
    } else {
      // 使用模拟数据
      results = await this.fetchFromMock(params)
    }

    // 排序并标记最低价
    const successResults = results
      .filter(r => r)
      .sort((a, b) => a.price - b.price)

    if (successResults.length > 0) {
      successResults[0].isLowest = true
    }

    const response = {
      results: successResults,
      total: successResults.length,
      successCount: successResults.length,
      failCount: results.length - successResults.length
    }

    cacheService.set(cacheKey, response)

    logger.info('比价完成', {
      queryId,
      dataSource: source,
      successCount: successResults.length,
      failCount: results.length - successResults.length
    })

    return {
      queryId,
      queryTime,
      dataSource: source,
      ...response,
      fromCache: false
    }
  }

  /**
   * 从模拟数据源获取价格
   */
  async fetchFromMock(params) {
    const promises = Object.entries(this.crawlers)
      .filter(([code]) => COURIER_CONFIG[code]?.enabled)
      .map(([code, crawler]) => {
        return this.fetchPriceFromCrawler(crawler, code, params)
      })

    const results = await Promise.allSettled(promises)
    return results
      .filter(r => r.status === 'fulfilled' && r.value)
      .map(r => r.value)
  }

  /**
   * 从快递100获取价格
   */
  async fetchFromKuaidi100(params) {
    try {
      if (!kuaidi100Service.isAvailable()) {
        logger.warn('快递100配置不完整，回退到模拟数据')
        return this.fetchFromMock(params)
      }

      const prices = await kuaidi100Service.getPrices(params)
      return prices
    } catch (error) {
      logger.error('快递100查询失败，回退到模拟数据', { error: error.message })
      return this.fetchFromMock(params)
    }
  }

  async fetchPriceFromCrawler(crawler, code, params) {
    try {
      const timeout = COURIER_CONFIG[code]?.timeout || 10000

      const result = await Promise.race([
        crawler.getPrice(params),
        this.timeout(timeout)
      ])

      return {
        courierCode: code,
        courierName: COURIER_CONFIG[code].name,
        courierLogo: COURIER_CONFIG[code].logo,
        ...result,
        dataSource: 'mock',
        isLowest: false
      }
    } catch (error) {
      logger.warn(`爬取${code}失败`, { error: error.message })
      return null
    }
  }

  timeout(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), ms)
    })
  }

  generateQueryId() {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getCacheKey(params) {
    const { senderProvince, senderCity, receiverProvince, receiverCity, weight, dataSource } = params
    return `price:${dataSource}:${senderProvince}:${senderCity}:${receiverProvince}:${receiverCity}:${weight}`
  }

  getAddressOptions() {
    return require('../data/address.json')
  }

  /**
   * 获取可用的数据源列表
   */
  getDataSources() {
    const sources = [
      { value: 'mock', label: '模拟数据（免费）', available: true }
    ]

    if (kuaidi100Service.isAvailable()) {
      sources.push({ value: 'kuaidi100', label: '快递100（真实数据）', available: true })
    } else {
      sources.push({ value: 'kuaidi100', label: '快递100（需配置）', available: false })
    }

    return sources
  }
}

module.exports = new CourierService()
