const rateLimit = require('express-rate-limit')
const config = require('../config')

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    code: 429,
    message: '请求过于频繁，请稍后再试',
    data: null
  },
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = limiter
