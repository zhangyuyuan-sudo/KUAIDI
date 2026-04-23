const path = require('path')

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  log: {
    level: process.env.LOG_LEVEL || 'info',
    dir: path.join(__dirname, '../../logs')
  },
  
  cache: {
    ttl: 5 * 60 * 1000,
    checkPeriod: 60 * 1000
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
}

module.exports = config
