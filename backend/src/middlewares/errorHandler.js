const logger = require('../utils/logger')

function errorHandler(err, req, res, next) {
  logger.error('全局错误', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body
  })
  
  const statusCode = err.statusCode || 500
  const message = err.message || '服务器内部错误'
  
  res.status(statusCode).json({
    code: statusCode,
    message,
    data: null
  })
}

function notFoundHandler(req, res) {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null
  })
}

module.exports = {
  errorHandler,
  notFoundHandler
}
