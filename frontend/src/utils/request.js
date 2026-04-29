import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res.data
  },
  error => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message || '网络错误'
    
    if (status === 404) {
      router.push('/error?code=404&message=' + encodeURIComponent(message))
    } else if (status === 403) {
      router.push('/error?code=403&message=' + encodeURIComponent(message))
    } else if (status === 500) {
      router.push('/error?code=500&message=' + encodeURIComponent(message))
    } else if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
      router.push('/error?code=408&message=' + encodeURIComponent('请求超时'))
    } else if (!error.response) {
      router.push('/error?code=network&message=' + encodeURIComponent('网络连接失败'))
    } else {
      ElMessage.error(message)
    }
    
    return Promise.reject(error)
  }
)

export default request
