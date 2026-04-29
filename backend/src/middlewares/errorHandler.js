const logger = require('../utils/logger')

function errorHandler(err, req, res, next) {
  // 确保错误信息是字符串
  let errorMessage = '服务器内部错误'
  let errorStack = ''
  
  if (err) {
    if (typeof err === 'string') {
      errorMessage = err
    } else if (err.message) {
      errorMessage = err.message
    } else if (err.toString && err.toString() !== '[object Object]') {
      errorMessage = err.toString()
    }
    
    if (err.stack) {
      errorStack = err.stack
    }
  }
  
  logger.error('全局错误', {
    message: errorMessage,
    stack: errorStack,
    url: req.url,
    method: req.method,
    body: req.body,
    errorType: typeof err,
    rawError: err
  })
  
  const statusCode = err?.statusCode || 500
  
  res.status(statusCode).json({
    code: statusCode,
    message: errorMessage,
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
