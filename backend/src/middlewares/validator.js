const Joi = require('joi')

const compareSchema = Joi.object({
  senderProvince: Joi.string().required().messages({
    'string.empty': '寄件省份不能为空',
    'any.required': '寄件省份是必填项'
  }),
  senderCity: Joi.string().required().messages({
    'string.empty': '寄件城市不能为空',
    'any.required': '寄件城市是必填项'
  }),
  senderDistrict: Joi.string().allow(''),
  receiverProvince: Joi.string().required().messages({
    'string.empty': '收件省份不能为空',
    'any.required': '收件省份是必填项'
  }),
  receiverCity: Joi.string().required().messages({
    'string.empty': '收件城市不能为空',
    'any.required': '收件城市是必填项'
  }),
  receiverDistrict: Joi.string().allow(''),
  receiverDetail: Joi.string().allow(''),
  receiverName: Joi.string().allow(''),
  receiverPhone: Joi.string().allow(''),
  weight: Joi.number().min(0.1).max(100).required().messages({
    'number.base': '重量必须是数字',
    'number.min': '重量不能小于0.1kg',
    'number.max': '重量不能超过100kg',
    'any.required': '重量是必填项'
  }),
  dataSource: Joi.string().valid('mock', 'kuaidi100').default('mock')
})

function validateCompare(req, res, next) {
  const { error } = compareSchema.validate(req.body, { abortEarly: false })
  
  if (error) {
    const messages = error.details.map(d => d.message).join('; ')
    return res.status(400).json({
      code: 400,
      message: messages,
      data: null
    })
  }
  
  next()
}

module.exports = {
  validateCompare
}
