import request from '@/utils/request'

export const orderApi = {
  // 创建订单
  create(data) {
    return request({
      url: '/order/create',
      method: 'post',
      data
    })
  },

  // 获取订单列表
  getList() {
    return request({
      url: '/order/list',
      method: 'get'
    })
  },

  // 获取订单详情
  getDetail(id) {
    return request({
      url: `/order/detail/${id}`,
      method: 'get'
    })
  },

  // 取消订单
  cancel(data) {
    return request({
      url: '/order/cancel',
      method: 'post',
      data
    })
  },

  // 支付同步
  syncPay(data) {
    return request({
      url: '/order/syncPay',
      method: 'post',
      data
    })
  },

  // 刷新订单状态（从快递100查询最新状态）
  refreshStatus(id) {
    return request({
      url: `/order/refresh/${id}`,
      method: 'post'
    })
  }
}
