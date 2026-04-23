<template>
  <div class="orders-page">
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
          <button class="refresh-btn" @click="loadOrders" :disabled="loading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ spinning: loading }">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            刷新
          </button>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <div class="page-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="page-title-group">
            <h1 class="page-title">我的订单</h1>
            <p class="page-subtitle">查看和管理您的所有订单</p>
          </div>
        </div>
        
        <div v-if="loading" class="loading-state">
          <div class="loading-animation">
            <div class="loading-circle"></div>
            <div class="loading-circle"></div>
            <div class="loading-circle"></div>
          </div>
          <p class="loading-text">加载中...</p>
        </div>
        
        <div v-else-if="orders.length === 0" class="empty-state">
          <div class="empty-illustration">
            <svg viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
              <rect x="60" y="50" width="80" height="100" rx="8" fill="#E5E7EB"/>
              <rect x="70" y="60" width="60" height="8" rx="2" fill="#D1D5DB"/>
              <rect x="70" y="80" width="40" height="6" rx="2" fill="#D1D5DB"/>
              <rect x="70" y="100" width="50" height="6" rx="2" fill="#D1D5DB"/>
              <circle cx="100" cy="140" r="12" fill="#9CA3AF"/>
              <path d="M95 140l5 5 10-10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="empty-title">暂无订单</h3>
          <p class="empty-desc">您还没有任何订单，快去下单吧</p>
          <button class="empty-btn" @click="goHome">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            去下单
          </button>
        </div>
        
        <div v-else class="orders-list">
          <div 
            v-for="(order, index) in orders" 
            :key="order.id" 
            class="order-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">{{ order.id }}</span>
                <span class="order-time">{{ formatTime(order.createTime) }}</span>
              </div>
              <div class="order-status" :class="getStatusClass(order.status)">
                <span class="status-dot"></span>
                {{ getStatusText(order.status) }}
              </div>
            </div>
            
            <div class="order-body">
              <div class="address-section">
                <div class="address-item sender">
                  <div class="address-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    寄件
                  </div>
                  <div class="address-content">
                    <div class="address-name">{{ order.senderName }}</div>
                    <div class="address-addr">{{ order.senderAddress }}</div>
                  </div>
                </div>
                
                <div class="address-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                
                <div class="address-item receiver">
                  <div class="address-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    收件
                  </div>
                  <div class="address-content">
                    <div class="address-name">{{ order.receiverName }}</div>
                    <div class="address-addr">{{ order.receiverAddress }}</div>
                  </div>
                </div>
              </div>
              
              <div class="courier-section">
                <div class="courier-info">
                  <div class="courier-logo" :style="{ background: getLogoGradient(order.courierCode) }">
                    {{ order.courierName?.charAt(0) }}
                  </div>
                  <div class="courier-detail">
                    <div class="courier-name">{{ order.courierName }}</div>
                    <div v-if="order.kuaidiNum" class="tracking-no">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M3 9h18M9 21V9"/>
                      </svg>
                      {{ order.kuaidiNum }}
                    </div>
                  </div>
                </div>
                <div class="courier-price">
                  <span class="currency">¥</span>
                  <span class="amount">{{ order.price }}</span>
                </div>
              </div>
            </div>
            
            <div class="order-footer">
              <div class="order-actions">
                <button 
                  class="action-btn primary"
                  :class="{ loading: refreshingId === order.id }"
                  :disabled="refreshingId === order.id"
                  @click="refreshStatus(order.id)"
                >
                  <svg v-if="refreshingId !== order.id" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  <span v-else class="btn-spinner"></span>
                  更新状态
                </button>
                <button 
                  v-if="order.status < 10"
                  class="action-btn danger"
                  @click="cancelOrder(order.id)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  取消订单
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderApi } from '@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const orders = ref([])
const loading = ref(false)
const refreshingId = ref(null)

const statusMap = {
  0: { text: '已下单', class: 'pending' },
  1: { text: '待接单', class: 'waiting' },
  2: { text: '已接单', class: 'accepted' },
  3: { text: '已取件', class: 'picked' },
  4: { text: '运输中', class: 'shipping' },
  5: { text: '已签收', class: 'completed' },
  9: { text: '已取消', class: 'cancelled' },
  610: { text: '已取消', class: 'cancelled' },
  99: { text: '已取消', class: 'cancelled' },
  '-1': { text: '下单失败', class: 'failed' }
}

function getStatusText(status) {
  return statusMap[status]?.text || '未知状态'
}

function getStatusClass(status) {
  return statusMap[status]?.class || 'unknown'
}

function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

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

async function refreshStatus(orderId) {
  refreshingId.value = orderId
  try {
    const res = await orderApi.refreshStatus(orderId)
    ElMessage.success('状态已更新')
    await loadOrders()
  } catch (error) {
    ElMessage.error(error.message || '刷新失败')
  } finally {
    refreshingId.value = null
  }
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
    await loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消失败')
    }
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style lang="scss" scoped>
.orders-page {
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
      
      .refresh-btn {
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
          
          &.spinning {
            animation: spin 1s linear infinite;
          }
        }
        
        &:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.25);
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
      max-width: 900px;
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
    
    .loading-state {
      padding: 80px 20px;
      text-align: center;
      
      .loading-animation {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-bottom: 20px;
        
        .loading-circle {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #2563EB;
          animation: bounce 1.4s ease-in-out infinite;
          
          &:nth-child(1) { animation-delay: 0s; }
          &:nth-child(2) { animation-delay: 0.2s; }
          &:nth-child(3) { animation-delay: 0.4s; }
        }
      }
      
      .loading-text {
        font-size: 15px;
        color: #6B7280;
        margin: 0;
      }
    }
    
    .empty-state {
      padding: 80px 20px;
      text-align: center;
      
      .empty-illustration {
        margin-bottom: 24px;
        
        svg {
          width: 160px;
          height: 160px;
          animation: float 3s ease-in-out infinite;
        }
      }
      
      .empty-title {
        font-size: 20px;
        font-weight: 600;
        color: #1F2937;
        margin: 0 0 8px 0;
      }
      
      .empty-desc {
        font-size: 14px;
        color: #6B7280;
        margin: 0 0 24px 0;
      }
      
      .empty-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 28px;
        background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
        border: none;
        border-radius: 14px;
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        
        svg {
          width: 18px;
          height: 18px;
        }
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }
      }
    }
    
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      .order-card {
        background: #FFFFFF;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(0, 0, 0, 0.04);
        animation: cardFadeIn 0.5s ease forwards;
        opacity: 0;
        transform: translateY(20px);
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: #FAFAFA;
          border-bottom: 1px solid #F3F4F6;
          
          .order-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            
            .order-id {
              font-size: 14px;
              font-weight: 600;
              color: #1F2937;
              font-family: 'SF Mono', Monaco, monospace;
            }
            
            .order-time {
              font-size: 13px;
              color: #9CA3AF;
            }
          }
          
          .order-status {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            
            .status-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
            }
            
            &.pending {
              background: rgba(107, 114, 128, 0.1);
              color: #6B7280;
              
              .status-dot { background: #6B7280; }
            }
            
            &.waiting {
              background: rgba(245, 158, 11, 0.1);
              color: #D97706;
              
              .status-dot { background: #F59E0B; }
            }
            
            &.accepted, &.picked {
              background: rgba(59, 130, 246, 0.1);
              color: #2563EB;
              
              .status-dot { background: #3B82F6; }
            }
            
            &.shipping {
              background: rgba(139, 92, 246, 0.1);
              color: #7C3AED;
              
              .status-dot { background: #8B5CF6; }
            }
            
            &.completed {
              background: rgba(16, 185, 129, 0.1);
              color: #059669;
              
              .status-dot { background: #10B981; }
            }
            
            &.cancelled {
              background: rgba(107, 114, 128, 0.1);
              color: #6B7280;
              
              .status-dot { background: #9CA3AF; }
            }
            
            &.failed {
              background: rgba(239, 68, 68, 0.1);
              color: #DC2626;
              
              .status-dot { background: #EF4444; }
            }
          }
        }
        
        .order-body {
          padding: 20px 24px;
          
          .address-section {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 20px;
            
            .address-item {
              flex: 1;
              
              .address-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 8px;
                
                svg {
                  width: 14px;
                  height: 14px;
                }
              }
              
              &.sender .address-badge {
                background: rgba(16, 185, 129, 0.1);
                color: #10B981;
                
                svg { color: #10B981; }
              }
              
              &.receiver .address-badge {
                background: rgba(59, 130, 246, 0.1);
                color: #3B82F6;
                
                svg { color: #3B82F6; }
              }
              
              .address-content {
                .address-name {
                  font-size: 15px;
                  font-weight: 600;
                  color: #1F2937;
                  margin-bottom: 4px;
                }
                
                .address-addr {
                  font-size: 13px;
                  color: #6B7280;
                  line-height: 1.5;
                }
              }
            }
            
            .address-arrow {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              background: #F3F4F6;
              border-radius: 50%;
              flex-shrink: 0;
              margin-top: 24px;
              
              svg {
                width: 16px;
                height: 16px;
                color: #9CA3AF;
              }
            }
          }
          
          .courier-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: #F9FAFB;
            border-radius: 16px;
            
            .courier-info {
              display: flex;
              align-items: center;
              gap: 14px;
              
              .courier-logo {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFFFFF;
                font-size: 20px;
                font-weight: 700;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              }
              
              .courier-detail {
                .courier-name {
                  font-size: 16px;
                  font-weight: 600;
                  color: #1F2937;
                  margin-bottom: 4px;
                }
                
                .tracking-no {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-size: 13px;
                  color: #6B7280;
                  
                  svg {
                    width: 14px;
                    height: 14px;
                  }
                }
              }
            }
            
            .courier-price {
              display: flex;
              align-items: baseline;
              gap: 2px;
              
              .currency {
                font-size: 16px;
                color: #F59E0B;
                font-weight: 600;
              }
              
              .amount {
                font-size: 28px;
                color: #F59E0B;
                font-weight: 800;
                letter-spacing: -0.02em;
              }
            }
          }
        }
        
        .order-footer {
          padding: 16px 24px;
          background: #FAFAFA;
          border-top: 1px solid #F3F4F6;
          
          .order-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            
            .action-btn {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 10px 18px;
              border-radius: 10px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.25s ease;
              border: none;
              
              svg {
                width: 16px;
                height: 16px;
              }
              
              .btn-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: #FFFFFF;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
              }
              
              &.primary {
                background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
                color: #FFFFFF;
                box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
                
                &:hover:not(:disabled) {
                  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
                }
              }
              
              &.danger {
                background: #FFFFFF;
                color: #EF4444;
                border: 1px solid #FEE2E2;
                
                &:hover {
                  background: #FEF2F2;
                  border-color: #FECACA;
                }
              }
              
              &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
              }
            }
          }
        }
      }
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-12px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .orders-page {
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
        
        .page-title-group .page-title {
          font-size: 22px;
        }
      }
      
      .orders-list .order-card {
        .order-body {
          .address-section {
            flex-direction: column;
            
            .address-arrow {
              transform: rotate(90deg);
              margin: 8px 0;
            }
          }
          
          .courier-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            
            .courier-price {
              width: 100%;
              justify-content: flex-end;
            }
          }
        }
        
        .order-footer .order-actions {
          flex-direction: column;
          
          .action-btn {
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
