import { defineStore } from 'pinia'
import { ref } from 'vue'
import { courierApi } from '@/api/courier'

export const useCourierStore = defineStore('courier', () => {
  const loading = ref(false)
  const result = ref(null)
  const addressOptions = ref([])
  const dataSources = ref([])
  const currentDataSource = ref('kuaidi100')
  const queryInfo = ref({
    sender: '',
    receiver: '',
    weight: ''
  })
  // 存储原始查询参数（用于下单）
  const queryParams = ref(null)
  // 当前选中的快递公司
  const selectedCourier = ref(null)

  async function compare(params) {
    loading.value = true
    try {
      // 保存原始查询参数
      queryParams.value = { ...params }

      const senderParts = [params.senderProvince, params.senderCity, params.senderDistrict].filter(Boolean)
      const receiverParts = [params.receiverProvince, params.receiverCity, params.receiverDistrict].filter(Boolean)

      queryInfo.value = {
        sender: senderParts.join(' '),
        receiver: receiverParts.join(' '),
        weight: params.weight
      }
      // 传递数据源参数
      const data = await courierApi.compare({
        ...params,
        dataSource: currentDataSource.value
      })
      result.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function loadAddressOptions() {
    if (addressOptions.value.length === 0) {
      addressOptions.value = await courierApi.getAddressOptions()
    }
    return addressOptions.value
  }

  async function loadDataSources() {
    if (dataSources.value.length === 0) {
      const sources = await courierApi.getDataSources()
      dataSources.value = sources
      // 如果当前选中的不可用，默认选第一个可用的
      const current = sources.find(s => s.value === currentDataSource.value)
      if (!current || !current.available) {
        const available = sources.find(s => s.available)
        if (available) {
          currentDataSource.value = available.value
        }
      }
    }
    return dataSources.value
  }

  function setDataSource(source) {
    currentDataSource.value = source
  }

  function setSelectedCourier(courier) {
    selectedCourier.value = courier
  }

  function clearResult() {
    result.value = null
    queryInfo.value = {
      sender: '',
      receiver: '',
      weight: ''
    }
    queryParams.value = null
    selectedCourier.value = null
  }

  return {
    loading,
    result,
    addressOptions,
    dataSources,
    currentDataSource,
    queryInfo,
    queryParams,
    selectedCourier,
    compare,
    loadAddressOptions,
    loadDataSources,
    setDataSource,
    setSelectedCourier,
    clearResult
  }
})
