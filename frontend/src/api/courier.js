import request from '@/utils/request'

export const courierApi = {
  compare(data) {
    return request({
      url: '/courier/compare',
      method: 'post',
      data
    })
  },

  getAddressOptions() {
    return request({
      url: '/courier/address/options',
      method: 'get'
    })
  },

  getDataSources() {
    return request({
      url: '/courier/data-sources',
      method: 'get'
    })
  }
}
