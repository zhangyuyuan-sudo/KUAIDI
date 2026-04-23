<template>
  <div class="order-list-page">
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo" @click="goHome">
            <el-icon :size="28"><Box /></el-icon>
            <span class="title">快递比价</span>
          </div>
          <el-button @click="goHome" text>
            <el-icon><Back /></el-icon>
            返回首页
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h2>
            <el-icon><Document /></el-icon>
            我的订单
          </h2>
        </div>
        
        <div v-if="loading" class="loading-state">
          <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="orders.length === 0" class="empty-state">
          <el-empty description="暂无订单">
            <el-button type="primary" @click="goHome">去下单</el-button>
          </el-empty>
        </div>
        
        <div v-else class="order-list">
          <div 
            v-for="order in orders" 
            :key="order.id"
            class="order-card card"
          >
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">订单号：{{ order.id }}</span>
                <span class="order-time">{{ formatTime(order.createdAt) }}</span>
              </div>
              <el-tag :type="getStatusType(order.status)">
                {{ order.statusText }}
              </el-tag>
            </div>
            
            <el-divider />
            
            <div class="order-body">
              <div class="courier-info">
                <div class="courier-logo" :style="{ background: getLogoColor(order.courierCode) }">
                  {{ order.courierName?.charAt(0) }}
                </div>
                <div class="courier-name">{{ order.courierName }}</div>
              </div>
              
              <div class="route-info">
                <div class="route-item">
                  <div class="dot send"></div>
                  <span class="address">{{ order.senderAddress }}</span>
                </div>
                <div class="route-line"></div>
                <div class="route-item">
                  <div class="dot receive"></div>
                  <span class="address">{{ order.receiverAddress }}</span>
                </div>
              </div>
              
              <div class="price-info">
                <div class="price">¥{{ order.price?.toFixed(2) }}</div>
                <div class="pay-status" :class="order.payStatus === 1 ? 'paid' : 'unpaid'">
                  {{ order.payStatusText }}
                </div>
              </div>
            </div>
            
            <el-divider />
            
            <div class="order-footer">
              <div class="extra-info">
                <span v-if="order.kuaidiNum">快递单号：{{ order.kuaidiNum }}</span>
                <span v-if="order.courierName_real">快递员：{{ order.courierName_real }} {{ order.courierMobile }}</span>
              </div>
              <div class="actions">
                <el-button 
                  v-if="order.status === 0 || order.status === 1"
                  size="small"
                  @click="cancelOrder(order.id)"
                >
                  取消订单
                </el-button>
                <el-button 
                  v-if="order.status === 15 && order.payStatus !== 1"
                  type="primary"
                  size="small"
                  @click="payOrder(order.id)"
                >
                  支付运费
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderApi } from '@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Box, Back, Document, Loading } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const orders = ref([])

onMounted(() => {
  loadOrders()
})

async function loadOrders() {
  loading.value = true
  try {
    const res = await orderApi.getList()
    orders.value = res || []
  } catch (error) {
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function getStatusType(status) {
  const types = {
    0: 'info',
    1: 'primary',
    2: 'warning',
    10: 'success',
    15: 'danger',
    13: 'success',
    9: 'info',
    99: 'info'
  }
  return types[status] || 'info'
}

function getLogoColor(code) {
  const colors = {
    sf: '#FF6B00',
    zt: '#1E88E5',
    yt: '#E53935',
    yd: '#FF9800',
    st: '#4CAF50',
    jt: '#E91E63',
    ems: '#00BCD4',
    db: '#9C27B0',
    jd: '#E1251B'
  }
  return colors[code] || '#666'
}

async function cancelOrder(orderId) {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await orderApi.cancel({ orderId })
    ElMessage.success('取消成功')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消失败')
    }
  }
}

async function payOrder(orderId) {
  try {
    await orderApi.syncPay({ orderId })
    ElMessage.success('支付成功')
    loadOrders()
  } catch (error) {
    ElMessage.error(error.message || '支付失败')
  }
}

function goHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: #F5F7FA;
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 16px 0;
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        cursor: pointer;
        
        .title {
          font-size: 20px;
          font-weight: 600;
        }
      }
      
      .el-button {
        color: #fff;
      }
    }
  }
  
  .main-content {
    padding: 24px 0;
    
    .page-header {
      margin-bottom: 20px;
      
      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
        color: #303133;
        
        .el-icon {
          color: #409EFF;
        }
      }
    }
    
    .loading-state {
      text-align: center;
      padding: 80px 0;
      
      .loading-icon {
        animation: spin 1s linear infinite;
        color: #409EFF;
      }
      
      p {
        margin-top: 16px;
        color: #909399;
      }
    }
    
    .empty-state {
      padding: 60px 0;
    }
    
    .order-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .order-card {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .order-info {
            display: flex;
            gap: 16px;
            align-items: center;
            
            .order-id {
              font-weight: 500;
              color: #303133;
            }
            
            .order-time {
              color: #909399;
              font-size: 13px;
            }
          }
        }
        
        .order-body {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 12px 0;
          
          .courier-info {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 120px;
            
            .courier-logo {
              width: 36px;
              height: 36px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 16px;
              font-weight: bold;
            }
            
            .courier-name {
              font-size: 14px;
              color: #303133;
            }
          }
          
          .route-info {
            flex: 1;
            
            .route-item {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                
                &.send {
                  background: #67C23A;
                }
                
                &.receive {
                  background: #409EFF;
                }
              }
              
              .address {
                color: #606266;
                font-size: 14px;
              }
            }
            
            .route-line {
              width: 1px;
              height: 20px;
              background: #DCDFE6;
              margin-left: 3.5px;
            }
          }
          
          .price-info {
            text-align: right;
            width: 100px;
            
            .price {
              font-size: 20px;
              font-weight: 700;
              color: #F56C6C;
            }
            
            .pay-status {
              font-size: 12px;
              margin-top: 4px;
              
              &.paid {
                color: #67C23A;
              }
              
              &.unpaid {
                color: #909399;
              }
            }
          }
        }
        
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .extra-info {
            display: flex;
            gap: 16px;
            color: #909399;
            font-size: 13px;
          }
          
          .actions {
            display: flex;
            gap: 8px;
          }
        }
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
