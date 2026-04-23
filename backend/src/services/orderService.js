const fs = require('fs')
const path = require('path')
const logger = require('../utils/logger')

// 使用 sql.js (纯 JavaScript SQLite)
let SQL = null
let db = null

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../../data/orders.db')

class OrderService {
  constructor() {
    this.init()
  }

  // 初始化数据库
  async init() {
    try {
      // 动态导入 sql.js
      const initSqlJs = require('sql.js')
      SQL = await initSqlJs()
      
      // 确保数据目录存在
      const dataDir = path.dirname(DB_PATH)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      // 如果数据库文件存在，加载它
      if (fs.existsSync(DB_PATH)) {
        const filebuffer = fs.readFileSync(DB_PATH)
        db = new SQL.Database(filebuffer)
        logger.info('SQLite 数据库已加载:', DB_PATH)
      } else {
        // 创建新数据库
        db = new SQL.Database()
        logger.info('SQLite 数据库已创建')
      }

      // 创建表
      this.createTable()
      
      // 保存到文件
      this.saveToFile()
    } catch (error) {
      logger.error('SQLite 初始化失败:', error.message)
      // 如果失败，尝试再次加载 sql.js
      try {
        if (!SQL) {
          const initSqlJs = require('sql.js')
          SQL = await initSqlJs()
        }
        db = new SQL.Database()
        this.createTable()
        logger.warn('使用内存模式运行，数据不会持久化')
      } catch (e) {
        logger.error('无法初始化 SQLite:', e.message)
      }
    }
  }

  // 保存数据库到文件
  saveToFile() {
    try {
      if (db) {
        const data = db.export()
        const buffer = Buffer.from(data)
        fs.writeFileSync(DB_PATH, buffer)
      }
    } catch (error) {
      logger.error('保存数据库失败:', error.message)
    }
  }

  // 创建订单表
  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        courierCode TEXT,
        courierName TEXT,
        price REAL,
        senderName TEXT,
        senderMobile TEXT,
        senderAddress TEXT,
        receiverName TEXT,
        receiverMobile TEXT,
        receiverAddress TEXT,
        cargo TEXT,
        weight REAL,
        dayType INTEGER,
        pickupStartTime TEXT,
        pickupEndTime TEXT,
        valinsPay REAL,
        status INTEGER DEFAULT 0,
        statusText TEXT DEFAULT '已下单',
        payStatus INTEGER DEFAULT 0,
        payStatusText TEXT DEFAULT '未支付',
        taskId TEXT,
        orderId TEXT,
        kuaidiNum TEXT,
        pollToken TEXT,
        cancelMsg TEXT,
        kuaidi100Response TEXT,
        failReason TEXT,
        courierName_real TEXT,
        courierMobile TEXT,
        actualWeight REAL,
        actualPrice REAL,
        createdAt TEXT,
        updatedAt TEXT
      )
    `
    
    try {
      db.run(sql)
      logger.info('订单表已就绪')
    } catch (error) {
      logger.error('创建表失败:', error.message)
    }
  }

  // 生成平台订单号
  generateOrderId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(1000 + Math.random() * 9000)
    return `KD${date}${random}`
  }

  // 创建订单
  async createOrder(orderData) {
    const orderId = this.generateOrderId()
    const now = new Date().toISOString()
    
    const order = {
      id: orderId,
      ...orderData,
      status: 0,
      statusText: '已下单',
      payStatus: 0,
      payStatusText: '未支付',
      createdAt: now,
      updatedAt: now
    }

    const sql = `
      INSERT INTO orders (
        id, courierCode, courierName, price, senderName, senderMobile, senderAddress,
        receiverName, receiverMobile, receiverAddress, cargo, weight, dayType,
        pickupStartTime, pickupEndTime, valinsPay, status, statusText,
        payStatus, payStatusText, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    const params = [
      order.id, order.courierCode, order.courierName, order.price,
      order.senderName, order.senderMobile, order.senderAddress,
      order.receiverName, order.receiverMobile, order.receiverAddress,
      order.cargo, order.weight, order.dayType, order.pickupStartTime,
      order.pickupEndTime, order.valinsPay, order.status, order.statusText,
      order.payStatus, order.payStatusText, order.createdAt, order.updatedAt
    ]

    try {
      db.run(sql, params)
      this.saveToFile()
      logger.info(`订单创建成功: ${orderId}`)
      return order
    } catch (error) {
      logger.error('创建订单失败:', error.message)
      throw error
    }
  }

  // 根据ID获取订单
  async getOrder(orderId) {
    const sql = 'SELECT * FROM orders WHERE id = ?'
    
    try {
      const stmt = db.prepare(sql)
      const row = stmt.getAsObject([orderId])
      stmt.free()
      return Object.keys(row).length > 0 ? row : null
    } catch (error) {
      logger.error('查询订单失败:', error.message)
      throw error
    }
  }

  // 获取所有订单
  async getAllOrders() {
    const sql = 'SELECT * FROM orders ORDER BY createdAt DESC'
    
    try {
      const stmt = db.prepare(sql)
      const rows = []
      while (stmt.step()) {
        rows.push(stmt.getAsObject())
      }
      stmt.free()
      return rows
    } catch (error) {
      logger.error('查询订单列表失败:', error.message)
      throw error
    }
  }

  // 更新订单状态
  async updateOrderStatus(orderId, status, extraData = {}) {
    const statusMap = {
      0: '已下单',
      1: '已接单',
      2: '收件中',
      10: '已取件',
      15: '已结算',
      13: '已签收',
      9: '已取消',
      99: '已取消',
      610: '下单失败'
    }

    const statusText = statusMap[status] || '未知状态'
    const now = new Date().toISOString()

    // 构建动态更新语句
    let updateFields = ['status = ?', 'statusText = ?', 'updatedAt = ?']
    let params = [status, statusText, now]

    // 添加额外字段
    if (extraData.taskId) {
      updateFields.push('taskId = ?')
      params.push(extraData.taskId)
    }
    if (extraData.orderId) {
      updateFields.push('orderId = ?')
      params.push(extraData.orderId)
    }
    if (extraData.kuaidiNum) {
      updateFields.push('kuaidiNum = ?')
      params.push(extraData.kuaidiNum)
    }
    if (extraData.pollToken) {
      updateFields.push('pollToken = ?')
      params.push(extraData.pollToken)
    }
    if (extraData.courierName_real) {
      updateFields.push('courierName_real = ?')
      params.push(extraData.courierName_real)
    }
    if (extraData.courierMobile) {
      updateFields.push('courierMobile = ?')
      params.push(extraData.courierMobile)
    }
    if (extraData.actualWeight) {
      updateFields.push('actualWeight = ?')
      params.push(extraData.actualWeight)
    }
    if (extraData.actualPrice) {
      updateFields.push('actualPrice = ?')
      params.push(extraData.actualPrice)
    }
    if (extraData.failReason) {
      updateFields.push('failReason = ?')
      params.push(extraData.failReason)
    }
    if (extraData.kuaidi100Response) {
      updateFields.push('kuaidi100Response = ?')
      params.push(JSON.stringify(extraData.kuaidi100Response))
    }

    params.push(orderId)

    const sql = `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`

    try {
      db.run(sql, params)
      this.saveToFile()
      logger.info(`订单状态更新: ${orderId} -> ${statusText}`)
      return { orderId, status, statusText }
    } catch (error) {
      logger.error(`更新订单状态失败: ${orderId}`, error.message)
      throw error
    }
  }

  // 更新支付状态
  async updatePayStatus(orderId, payStatus) {
    const payStatusMap = {
      0: '未支付',
      1: '已支付',
      3: '退款中',
      4: '已退款'
    }

    const payStatusText = payStatusMap[payStatus] || '未知'
    const now = new Date().toISOString()

    const sql = 'UPDATE orders SET payStatus = ?, payStatusText = ?, updatedAt = ? WHERE id = ?'
    const params = [payStatus, payStatusText, now, orderId]

    try {
      db.run(sql, params)
      this.saveToFile()
      logger.info(`订单支付状态更新: ${orderId} -> ${payStatusText}`)
      return { orderId, payStatus, payStatusText }
    } catch (error) {
      logger.error(`更新支付状态失败: ${orderId}`, error.message)
      throw error
    }
  }

  // 取消订单
  async cancelOrder(orderId, cancelMsg = '') {
    const now = new Date().toISOString()
    const sql = 'UPDATE orders SET status = 9, statusText = ?, cancelMsg = ?, updatedAt = ? WHERE id = ?'
    const params = ['已取消', cancelMsg, now, orderId]

    try {
      db.run(sql, params)
      this.saveToFile()
      logger.info(`订单取消: ${orderId}, 原因: ${cancelMsg}`)
      return { orderId, status: 9, statusText: '已取消' }
    } catch (error) {
      logger.error(`取消订单失败: ${orderId}`, error.message)
      throw error
    }
  }
}

module.exports = new OrderService()
