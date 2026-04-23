const express = require('express')
const courierRoutes = require('./courier')
const orderRoutes = require('./order')

const router = express.Router()

router.use('/courier', courierRoutes)
router.use('/order', orderRoutes)

router.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: 'ok',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString()
    }
  })
})

module.exports = router
