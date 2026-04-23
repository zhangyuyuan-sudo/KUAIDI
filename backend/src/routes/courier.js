const express = require('express')
const router = express.Router()
const courierController = require('../controllers/courierController')
const { validateCompare } = require('../middlewares/validator')
const rateLimit = require('../middlewares/rateLimit')

router.post('/compare', rateLimit, validateCompare, courierController.compare)
router.get('/address/options', courierController.getAddressOptions)
router.get('/data-sources', courierController.getDataSources)
router.get('/health', courierController.health)

module.exports = router
