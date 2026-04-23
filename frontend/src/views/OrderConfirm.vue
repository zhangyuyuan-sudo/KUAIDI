<template>
  <div class="order-confirm-page">
    <header class="header">
      <div class="header-bg"></div>
      <div class="container">
        <nav class="nav">
          <div class="logo" @click="goHome">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 8L12 3L4 8V20H8V14H16V20H20V8Z"/>
              </svg>
            </div>
            <span class="logo-text">快递比价</span>
          </div>
          <button class="back-btn" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回
          </button>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <div class="page-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <div class="page-title-group">
            <h1 class="page-title">确认订单信息</h1>
            <p class="page-subtitle">请核对以下信息后提交订单</p>
          </div>
        </div>
        
        <div class="content-grid">
          <div class="main-column">
            <section class="info-card">
              <div class="card-header">
                <div class="card-icon sender">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h3 class="card-title">寄件人信息</h3>
                <span class="card-badge">发</span>
              </div>
              <div class="card-body">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">姓名</span>
                    <span class="info-value">{{ senderInfo.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">电话</span>
                    <span class="info-value">{{ senderInfo.mobile }}</span>
                  </div>
                  <div class="info-item full-width">
                    <span class="info-label">地址</span>
                    <span class="info-value">{{ senderInfo.address }}</span>
                  </div>
                </div>
              </div>
            </section>
            
            <section class="info-card">
              <div class="card-header">
                <div class="card-icon receiver">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3 class="card-title">收件人信息</h3>
                <span class="card-badge receiver">收</span>
              </div>
              <div class="card-body">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">姓名</span>
                    <span class="info-value">{{ receiverInfo.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">电话</span>
                    <span class="info-value">{{ receiverInfo.mobile }}</span>
                  </div>
                  <div class="info-item full-width">
                    <span class="info-label">地址</span>
                    <span class="info-value">{{ receiverInfo.address }}</span>
                  </div>
                </div>
              </div>
            </section>
            
            <section class="info-card courier-card">
              <div class="card-header">
                <div class="card-icon courier">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h4l3 3v5h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <h3 class="card-title">快递信息</h3>
              </div>
              <div class="card-body">
                <div class="courier-selected">
                  <div class="courier-logo" :style="{ background: getLogoGradient(selectedCourier?.courierCode) }">
                    {{ selectedCourier?.courierName?.charAt(0) }}
                  </div>
                  <div class="courier-detail">
                    <div class="courier-name">{{ selectedCourier?.courierName }}</div>
                    <div class="service-type">{{ selectedCourier?.serviceType }}</div>
                  </div>
                  <div class="courier-price">
                    <span class="currency">¥</span>
                    <span class="amount">{{ selectedCourier?.price?.toFixed(2) }}</span>
                  </div>
                </div>
                
                <div class="package-info">
                  <div class="package-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 8L12 3L4 8V20H8V14H16V20H20V8Z"/>
                    </svg>
                    <span class="package-label">物品</span>
                    <span class="package-value">{{ cargo }}</span>
                  </div>
                  <div class="package-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <span class="package-label">重量</span>
                    <span class="package-value">{{ weight }} kg</span>
                  </div>
                </div>
              </div>
            </section>
            
            <section class="info-card schedule-card">
              <div class="card-header">
                <div class="card-icon schedule">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <h3 class="card-title">预约取件</h3>
                <span class="card-badge optional">可选</span>
              </div>
              <div class="card-body">
                <div class="schedule-form">
                  <div class="form-row">
                    <label class="form-label">取件日期</label>
                    <div class="date-options">
                      <button 
                        v-for="day in ['今天', '明天', '后天']" 
                        :key="day"
                        class="date-btn"
                        :class="{ active: orderForm.dayType === day }"
                        @click="orderForm.dayType = day"
                      >
                        {{ day }}
                      </button>
                    </div>
                  </div>
                  <div v-if="orderForm.dayType === '今天'" class="time-notice">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span>今天下单需提前2小时预约，最早可选 {{ minStartTime }}</span>
                  </div>
                  <div v-else class="time-notice info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span>快递100仅支持预约3天内（今天/明天/后天）</span>
                  </div>
                  
                  <div class="form-row">
                    <label class="form-label">时间段</label>
                    <div class="time-range">
                      <div class="time-select">
                        <select v-model="orderForm.pickupStartTime" class="time-input">
                          <option value="">开始时间</option>
                          <option v-for="time in generateTimeOptions(minStartTime)" :key="time" :value="time">
                            {{ time }}
                          </option>
                        </select>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="select-arrow">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                      <span class="time-separator">至</span>
                      <div class="time-select">
                        <select v-model="orderForm.pickupEndTime" class="time-input">
                          <option value="">结束时间</option>
                          <option v-for="time in generateTimeOptions('08:00')" :key="time" :value="time">
                            {{ time }}
                          </option>
                        </select>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="select-arrow">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          <div class="side-column">
            <div class="price-summary sticky">
              <div class="summary-header">
                <h3 class="summary-title">费用明细</h3>
              </div>
              <div class="summary-body">
                <div class="fee-row">
                  <span class="fee-label">运费</span>
                  <span class="fee-value">¥{{ selectedCourier?.price?.toFixed(2) }}</span>
                </div>
                <div class="fee-row">
                  <span class="fee-label">保价费</span>
                  <span class="fee-value">¥0.00</span>
                </div>
                <div class="fee-row">
                  <span class="fee-label">包装费</span>
                  <span class="fee-value">¥0.00</span>
                </div>
              </div>
              <div class="summary-footer">
                <div class="total-row">
                  <span class="total-label">合计</span>
                  <div class="total-price">
                    <span class="currency">¥</span>
                    <span class="amount">{{ selectedCourier?.price?.toFixed(2) }}</span>
                  </div>
                </div>
                <button 
                  class="submit-btn"
                  :class="{ loading: submitting }"
                  :disabled="submitting"
                  @click="submitOrder"
                >
                  <svg v-if="!submitting" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span v-else class="loading-spinner"></span>
                  {{ submitting ? '提交中...' : '确认下单' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCourierStore } from '@/stores/courier'
import { orderApi } from '@/api/order'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useCourierStore()

const submitting = ref(false)

const orderForm = ref({
  dayType: '今天',
  pickupStartTime: '',
  pickupEndTime: ''
})

const minStartTime = computed(() => {
  if (orderForm.value.dayType !== '今天') {
    return '08:00'
  }
  
  const now = new Date()
  const currentHour = now.getHours()
  let minHour = currentHour + 2
  
  if (minHour >= 20) {
    return '08:00'
  }
  
  if (now.getMinutes() > 0) {
    minHour += 1
  }
  
  if (minHour > 20) {
    minHour = 20
  }
  
  return `${String(minHour).padStart(2, '0')}:00`
})

watch(() => orderForm.value.dayType, () => {
  orderForm.value.pickupStartTime = ''
  orderForm.value.pickupEndTime = ''
})

const senderInfo = {
  name: '党娅琪',
  mobile: '18202797209',
  address: '广东省深圳市南山区大族科技中心1110'
}

function buildAddress(province, city, district, detail) {
  const isMunicipality = province === city
  const parts = isMunicipality 
    ? [province, district, detail] 
    : [province, city, district, detail]
  return parts.filter(Boolean).join('')
}

const receiverInfo = computed(() => {
  const params = store.queryParams
  if (!params) return { name: '', mobile: '', address: '' }
  
  return {
    name: params.receiverName || '',
    mobile: params.receiverPhone || '',
    address: buildAddress(params.receiverProvince, params.receiverCity, params.receiverDistrict, params.receiverDetail)
  }
})

const selectedCourier = computed(() => store.selectedCourier)

const cargo = computed(() => {
  const params = store.queryParams
  return params?.cargo || '物品'
})

const weight = computed(() => {
  const params = store.queryParams
  return params?.weight || 1
})

function generateTimeOptions(startTime) {
  const options = []
  const [startHour] = startTime.split(':').map(Number)
  for (let h = startHour; h <= 20; h++) {
    options.push(`${String(h).padStart(2, '0')}:00`)
  }
  return options
}

onMounted(() => {
  if (!store.selectedCourier || !store.queryParams) {
    ElMessage.warning('请先进行比价查询')
    router.push('/')
  }
})

function getLogoGradient(code) {
  const gradients = {
    sf: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
    zt: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
    yt: 'linear-gradient(135deg, #E53935 0%, #EF5350 100%)',
    yd: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
    st: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
    jt: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
    ems: 'linear-gradient(135deg, #00BCD4 0%, #4DD0E1 100%)',
    db: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
    jd: 'linear-gradient(135deg, #E1251B 0%, #FF5252 100%)'
  }
  return gradients[code] || 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'
}

function goHome() {
  router.push('/')
}

function goBack() {
  router.back()
}

async function submitOrder() {
  if (!store.selectedCourier || !store.queryParams) {
    ElMessage.warning('订单信息不完整')
    return
  }

  if (orderForm.value.dayType === '今天') {
    const now = new Date()
    const currentHour = now.getHours()
    const selectedHour = parseInt(orderForm.value.pickupStartTime?.split(':')[0] || 0)
    
    if (selectedHour < currentHour + 2) {
      ElMessage.warning(`今天下单需提前2小时预约，请选择 ${minStartTime.value} 之后的时间`)
      return
    }
  }

  const params = store.queryParams
  const courier = store.selectedCourier

  submitting.value = true
  try {
    const getDayType = (dayType) => {
      switch(dayType.trim()) {
        case '今天': return '0'
        case '明天': return '1'
        case '后天': return '2'
        default: return '1'
      }
    }

    const res = await orderApi.create({
      courierCode: courier.courierCode,
      courierName: courier.courierName,
      price: courier.price,
      senderName: senderInfo.name,
      senderMobile: senderInfo.mobile,
      senderAddress: senderInfo.address,
      receiverName: params.receiverName || '',
      receiverMobile: params.receiverPhone || '',
      receiverAddress: buildAddress(params.receiverProvince, params.receiverCity, params.receiverDistrict, params.receiverDetail),
      cargo: cargo.value,
      weight: weight.value,
      dayType: getDayType(orderForm.value.dayType),
      pickupStartTime: orderForm.value.pickupStartTime,
      pickupEndTime: orderForm.value.pickupEndTime
    })

    ElMessage.success('下单成功！')
    router.push('/orders')
  } catch (error) {
    ElMessage.error(error.message || '下单失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.order-confirm-page {
  min-height: 100vh;
  background: #F9FAFB;
  
  .header {
    position: relative;
    padding: 0;
    background: transparent;
    
    .header-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%);
      border-radius: 0 0 40px 40px;
    }
    
    .nav {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      z-index: 10;
      
      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        transition: opacity 0.3s ease;
        
        &:hover {
          opacity: 0.9;
        }
        
        .logo-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          svg {
            width: 22px;
            height: 22px;
            color: #FFFFFF;
          }
        }
        
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.02em;
        }
      }
      
      .back-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        color: #FFFFFF;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        
        svg {
          width: 18px;
          height: 18px;
        }
        
        &:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      }
    }
  }
  
  .main-content {
    position: relative;
    margin-top: -80px;
    padding: 0 0 60px;
    z-index: 20;
    
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      
      .page-icon {
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
        
        svg {
          width: 28px;
          height: 28px;
          color: #FFFFFF;
        }
      }
      
      .page-title-group {
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1F2937;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }
        
        .page-subtitle {
          font-size: 15px;
          color: #6B7280;
          margin: 0;
        }
      }
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 24px;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }
    
    .main-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .info-card {
      background: #FFFFFF;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      }
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px 24px;
        background: #FAFAFA;
        border-bottom: 1px solid #F3F4F6;
        
        .card-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          svg {
            width: 20px;
            height: 20px;
          }
          
          &.sender {
            background: rgba(16, 185, 129, 0.1);
            
            svg {
              color: #10B981;
            }
          }
          
          &.receiver {
            background: rgba(59, 130, 246, 0.1);
            
            svg {
              color: #3B82F6;
            }
          }
          
          &.courier {
            background: rgba(245, 158, 11, 0.1);
            
            svg {
              color: #F59E0B;
            }
          }
          
          &.schedule {
            background: rgba(139, 92, 246, 0.1);
            
            svg {
              color: #8B5CF6;
            }
          }
        }
        
        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1F2937;
          margin: 0;
          flex: 1;
        }
        
        .card-badge {
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          
          &.receiver {
            background: rgba(59, 130, 246, 0.1);
            color: #3B82F6;
          }
          
          &.optional {
            background: #F3F4F6;
            color: #6B7280;
          }
        }
      }
      
      .card-body {
        padding: 20px 24px;
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            
            &.full-width {
              grid-column: 1 / -1;
            }
            
            .info-label {
              font-size: 12px;
              color: #9CA3AF;
              font-weight: 500;
            }
            
            .info-value {
              font-size: 15px;
              color: #1F2937;
              font-weight: 500;
            }
          }
        }
      }
    }
    
    .courier-card .card-body {
      .courier-selected {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: #F9FAFB;
        border-radius: 16px;
        margin-bottom: 16px;
        
        .courier-logo {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 24px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .courier-detail {
          flex: 1;
          
          .courier-name {
            font-size: 18px;
            font-weight: 700;
            color: #1F2937;
            margin-bottom: 4px;
          }
          
          .service-type {
            font-size: 13px;
            color: #6B7280;
          }
        }
        
        .courier-price {
          display: flex;
          align-items: baseline;
          gap: 2px;
          
          .currency {
            font-size: 18px;
            color: #F59E0B;
            font-weight: 600;
          }
          
          .amount {
            font-size: 32px;
            color: #F59E0B;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
        }
      }
      
      .package-info {
        display: flex;
        gap: 24px;
        
        .package-item {
          display: flex;
          align-items: center;
          gap: 10px;
          
          svg {
            width: 20px;
            height: 20px;
            color: #9CA3AF;
          }
          
          .package-label {
            font-size: 13px;
            color: #9CA3AF;
          }
          
          .package-value {
            font-size: 14px;
            color: #1F2937;
            font-weight: 600;
          }
        }
      }
    }
    
    .schedule-card .card-body {
      .schedule-form {
        .form-row {
          margin-bottom: 16px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .form-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 10px;
          }
          
          .date-options {
            display: flex;
            gap: 10px;
            
            .date-btn {
              flex: 1;
              padding: 12px 16px;
              background: #F3F4F6;
              border: 2px solid transparent;
              border-radius: 12px;
              font-size: 14px;
              font-weight: 500;
              color: #6B7280;
              cursor: pointer;
              transition: all 0.25s ease;
              
              &:hover {
                background: #E5E7EB;
              }
              
              &.active {
                background: rgba(37, 99, 235, 0.08);
                border-color: #2563EB;
                color: #2563EB;
              }
            }
          }
          
          .time-range {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .time-select {
              flex: 1;
              position: relative;
              
              .time-input {
                width: 100%;
                padding: 12px 40px 12px 16px;
                background: #F9FAFB;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                font-size: 14px;
                color: #1F2937;
                cursor: pointer;
                appearance: none;
                transition: all 0.25s ease;
                
                &:focus {
                  outline: none;
                  border-color: #2563EB;
                  background: #FFFFFF;
                }
              }
              
              .select-arrow {
                position: absolute;
                right: 14px;
                top: 50%;
                transform: translateY(-50%);
                width: 18px;
                height: 18px;
                color: #9CA3AF;
                pointer-events: none;
              }
            }
            
            .time-separator {
              font-size: 14px;
              color: #9CA3AF;
            }
          }
        }
        
        .time-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(245, 158, 11, 0.08);
          border-radius: 10px;
          margin-bottom: 16px;
          
          svg {
            width: 18px;
            height: 18px;
            color: #F59E0B;
            flex-shrink: 0;
          }
          
          span {
            font-size: 13px;
            color: #D97706;
          }
          
          &.info {
            background: rgba(59, 130, 246, 0.08);
            
            svg {
              color: #3B82F6;
            }
            
            span {
              color: #2563EB;
            }
          }
        }
      }
    }
    
    .side-column {
      @media (max-width: 1024px) {
        order: -1;
      }
      
      .price-summary {
        background: #FFFFFF;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(0, 0, 0, 0.04);
        
        &.sticky {
          position: sticky;
          top: 24px;
        }
        
        .summary-header {
          padding: 20px 24px;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          
          .summary-title {
            font-size: 16px;
            font-weight: 600;
            color: #FFFFFF;
            margin: 0;
          }
        }
        
        .summary-body {
          padding: 20px 24px;
          border-bottom: 1px solid #F3F4F6;
          
          .fee-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .fee-label {
              font-size: 14px;
              color: #6B7280;
            }
            
            .fee-value {
              font-size: 14px;
              color: #1F2937;
              font-weight: 500;
            }
          }
        }
        
        .summary-footer {
          padding: 20px 24px;
          
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            
            .total-label {
              font-size: 15px;
              font-weight: 600;
              color: #1F2937;
            }
            
            .total-price {
              display: flex;
              align-items: baseline;
              gap: 2px;
              
              .currency {
                font-size: 20px;
                color: #F59E0B;
                font-weight: 600;
              }
              
              .amount {
                font-size: 36px;
                color: #F59E0B;
                font-weight: 800;
                letter-spacing: -0.02em;
              }
            }
          }
          
          .submit-btn {
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            border: none;
            border-radius: 14px;
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
            
            svg {
              width: 20px;
              height: 20px;
            }
            
            .loading-spinner {
              width: 20px;
              height: 20px;
              border: 2px solid rgba(255, 255, 255, 0.3);
              border-top-color: #FFFFFF;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
            
            &:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
            }
            
            &:active:not(:disabled) {
              transform: translateY(0);
            }
            
            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .order-confirm-page {
    .main-content {
      .page-header {
        .page-icon {
          width: 48px;
          height: 48px;
          
          svg {
            width: 24px;
            height: 24px;
          }
        }
        
        .page-title-group {
          .page-title {
            font-size: 22px;
          }
        }
      }
      
      .info-card {
        .card-body {
          padding: 16px;
          
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      }
      
      .courier-card .card-body .courier-selected {
        flex-wrap: wrap;
        
        .courier-price {
          width: 100%;
          justify-content: flex-end;
          margin-top: 8px;
        }
      }
      
      .side-column .price-summary {
        .summary-footer .total-row .total-price .amount {
          font-size: 28px;
        }
      }
    }
  }
}
</style>
