require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const config = require('./config')
const logger = require('./utils/logger')
const routes = require('./routes')
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler')

const app = express()
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(item => item.trim())
  .filter(Boolean)

const corsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.length === 0 || corsOrigins.includes(origin)) {
      return callback(null, true)
    }

    logger.warn(`CORS blocked origin: ${origin}`)
    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}

app.use(helmet())
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`)
  next()
})

app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

const net = require('net')

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(startPort, () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1).then(resolve).catch(reject)
      } else {
        reject(err)
      }
    })
  })
}

async function startServer() {
  try {
    const port = await findAvailablePort(config.port)
    app.listen(port, () => {
      logger.info(`服务器启动成功，端口: ${port}`)
      logger.info(`环境: ${config.env}`)
      logger.info(`API文档: http://localhost:${port}/api`)
    })
  } catch (error) {
    logger.error('服务器启动失败', { error: error.message })
    process.exit(1)
  }
}

startServer()

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error.message)
  console.error('堆栈:', error.stack)
  logger.error('未捕获的异常', { error: error.message, stack: error.stack })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason)
  logger.error('未处理的Promise拒绝', { reason })
})

module.exports = app
