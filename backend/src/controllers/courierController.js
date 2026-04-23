const courierService = require('../services/courierService')
const logger = require('../utils/logger')

class CourierController {
  async compare(req, res, next) {
    try {
      const params = req.body
      logger.info('比价请求', { params })
      
      const result = await courierService.comparePrices(params)
      
      res.json({
        code: 200,
        message: 'success',
        data: result
      })
    } catch (error) {
      logger.error('比价失败', { error: error.message })
      next(error)
    }
  }
  
  async getAddressOptions(req, res, next) {
    try {
      const options = await courierService.getAddressOptions()
      res.json({
        code: 200,
        message: 'success',
        data: options
      })
    } catch (error) {
      next(error)
    }
  }

  async getDataSources(req, res, next) {
    try {
      const sources = courierService.getDataSources()
      res.json({
        code: 200,
        message: 'success',
        data: sources
      })
    } catch (error) {
      next(error)
    }
  }
  
  async health(req, res) {
    res.json({
      code: 200,
      message: 'ok',
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString()
      }
    })
  }
}

module.exports = new CourierController()
