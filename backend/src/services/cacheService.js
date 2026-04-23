const NodeCache = require('node-cache')
const config = require('../config')

const cache = new NodeCache({
  stdTTL: config.cache.ttl,
  checkperiod: config.cache.checkperiod,
  useClones: false
})

class CacheService {
  get(key) {
    return cache.get(key)
  }
  
  set(key, value, ttl = config.cache.ttl) {
    return cache.set(key, value, ttl)
  }
  
  del(key) {
    return cache.del(key)
  }
  
  flush() {
    cache.flushAll()
  }
  
  getStats() {
    return cache.getStats()
  }
}

module.exports = new CacheService()
