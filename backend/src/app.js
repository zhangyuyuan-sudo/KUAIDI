require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const config = require('./config')
const logger = require('./utils/logger')
const routes = require('./routes')
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`)
  next()
})

app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

function startServer() {
  const server = app.listen(config.port, () => {
    logger.info(`服务器启动成功，端口: ${config.port}`)
    logger.info(`环境: ${config.env}`)
    logger.info(`API地址: http://localhost:${config.port}/api`)
  })

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`端口 ${config.port} 已被占用，请释放该端口或通过 PORT 指定其他端口`)
    } else {
      logger.error('服务器启动失败', { error: error.message })
    }
    process.exit(1)
  })
}

startServer()

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error.message)
  console.error('堆栈:', error.stack)
  logger.error('未捕获的异常', { error: error.message, stack: error.stack })
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('未处理的 Promise 拒绝:', reason)
  logger.error('未处理的 Promise 拒绝', { reason })
})

module.exports = app
