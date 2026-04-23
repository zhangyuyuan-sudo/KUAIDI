const puppeteer = require('puppeteer')
const logger = require('../utils/logger')

class OpenClaw {
  constructor() {
    this.browser = null
    this.initPromise = null
  }
  
  async init() {
    if (this.initPromise) {
      return this.initPromise
    }
    
    this.initPromise = this._initBrowser()
    return this.initPromise
  }
  
  async _initBrowser() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    })
    
    logger.info('OpenClaw 浏览器初始化完成')
  }
  
  async fetch(options) {
    await this.init()
    
    const { url, method = 'GET', data, headers, timeout = 10000, waitFor } = options
    
    let page = null
    
    try {
      page = await this.browser.newPage()
      
      await page.setDefaultTimeout(timeout)
      await page.setRequestInterception(true)
      
      page.on('request', (request) => {
        const resourceType = request.resourceType()
        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
          request.abort()
        } else {
          request.continue()
        }
      })
      
      if (headers) {
        await page.setExtraHTTPHeaders(headers)
      }
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
      
      let response
      
      if (method === 'GET') {
        response = await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout
        })
      } else {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout })
      }
      
      if (waitFor) {
        await page.waitForSelector(waitFor, { timeout })
      }
      
      const result = await page.evaluate(() => {
        return document.body.innerText
      })
      
      return result
      
    } catch (error) {
      logger.error('OpenClaw fetch error', { url, error: error.message })
      throw error
    } finally {
      if (page) {
        await page.close()
      }
    }
  }
  
  async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      logger.info('OpenClaw 浏览器已关闭')
    }
  }
}

module.exports = new OpenClaw()
