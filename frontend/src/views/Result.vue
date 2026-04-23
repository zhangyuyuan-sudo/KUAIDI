<template>
  <div class="result-page">
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
          <button class="back-btn" @click="goHome">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            重新查询
          </button>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <div class="query-summary">
          <div class="summary-card">
            <div class="summary-item">
              <div class="summary-icon sender">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="summary-info">
                <span class="summary-label">寄件地</span>
                <span class="summary-value">{{ queryInfo.sender }}</span>
              </div>
            </div>
            <div class="summary-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div class="summary-item">
              <div class="summary-icon receiver">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="summary-info">
                <span class="summary-label">收件地</span>
                <span class="summary-value">{{ queryInfo.receiver }}</span>
              </div>
            </div>
            <div class="summary-weight">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 8L12 3L4 8V20H8V14H16V20H20V8Z"/>
              </svg>
              <span>{{ queryInfo.weight }} kg</span>
            </div>
          </div>
        </div>
        
        <div v-if="loading" class="loading-state">
          <div class="loading-animation">
            <div class="loading-circle"></div>
            <div class="loading-circle"></div>
            <div class="loading-circle"></div>
          </div>
          <p class="loading-text">正在查询各快递公司价格...</p>
          <p class="loading-subtext">预计需要3-5秒</p>
        </div>
        
        <div v-else-if="result" class="result-section">
          <div class="result-header">
            <div class="result-title-group">
              <h2 class="result-title">比价结果</h2>
              <div class="result-tags">
                <span class="tag" :class="result.dataSource === 'kuaidi100' ? 'success' : 'default'">
                  {{ result.dataSource === 'kuaidi100' ? '快递100真实数据' : '模拟数据' }}
                </span>
                <span class="tag success">{{ result.successCount }} 家可寄</span>
                <span v-if="result.failCount > 0" class="tag danger">{{ result.failCount }} 家不可寄</span>
              </div>
            </div>
          </div>
          
          <PriceList :results="result.results" />
          
          <div v-if="result.fromCache" class="cache-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>数据来源于缓存，可能不是最新价格</span>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-illustration">
            <svg viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
              <path d="M100 60v40l30 20" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round"/>
              <circle cx="100" cy="100" r="60" stroke="#E5E7EB" stroke-width="4"/>
            </svg>
          </div>
          <h3 class="empty-title">暂无查询结果</h3>
          <p class="empty-desc">请先输入寄件信息进行比价查询</p>
          <button class="empty-btn" @click="goHome">开始查询</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourierStore } from '@/stores/courier'
import PriceList from '@/components/courier/PriceList.vue'

const router = useRouter()
const store = useCourierStore()

const loading = computed(() => store.loading)
const result = computed(() => store.result)
const queryInfo = computed(() => store.queryInfo)

function goHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.header {
  position: relative;
  padding: 0 0 20px;
  
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: var(--gradient-hero);
    border-radius: 0 0 40px 40px;
  }
  
  .nav {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      
      .logo-icon {
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          width: 20px;
          height: 20px;
          color: #fff;
        }
      }
      
      .logo-text {
        font-size: 20px;
        font-weight: 700;
        color: #fff;
      }
    }
    
    .back-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-full);
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-normal);
      
      svg {
        width: 16px;
        height: 16px;
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    }
  }
}

.main-content {
  padding: 24px 0 60px;
  
  .query-summary {
    margin-bottom: 32px;
    
    .summary-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: 20px 28px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
        padding: 20px;
      }
      
      .summary-item {
        display: flex;
        align-items: center;
        gap: 14px;
        
        .summary-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          
          svg {
            width: 22px;
            height: 22px;
            color: #fff;
          }
          
          &.sender {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          }
          
          &.receiver {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          }
        }
        
        .summary-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          
          .summary-label {
            font-size: 12px;
            color: var(--text-muted);
            font-weight: 500;
          }
          
          .summary-value {
            font-size: 15px;
            color: var(--text-primary);
            font-weight: 600;
          }
        }
      }
      
      .summary-arrow {
        color: var(--text-muted);
        
        svg {
          width: 24px;
          height: 24px;
        }
        
        @media (max-width: 768px) {
          transform: rotate(90deg);
        }
      }
      
      .summary-weight {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
        border-radius: var(--radius-full);
        font-size: 14px;
        font-weight: 600;
        color: var(--accent-dark);
        
        svg {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
  
  .loading-state {
    text-align: center;
    padding: 80px 20px;
    
    .loading-animation {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 24px;
      
      .loading-circle {
        width: 12px;
        height: 12px;
        background: var(--primary-color);
        border-radius: 50%;
        animation: bounce 1.4s ease-in-out infinite;
        
        &:nth-child(1) { animation-delay: 0s; }
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }
    
    .loading-text {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 8px;
    }
    
    .loading-subtext {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0;
    }
  }
  
  .result-section {
    .result-header {
      margin-bottom: 24px;
      
      .result-title-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
        
        .result-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        
        .result-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          
          .tag {
            padding: 6px 14px;
            border-radius: var(--radius-full);
            font-size: 13px;
            font-weight: 500;
            
            &.default {
              background: var(--bg-tertiary);
              color: var(--text-secondary);
            }
            
            &.success {
              background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
              color: var(--success-color);
            }
            
            &.danger {
              background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
              color: var(--danger-color);
            }
          }
        }
      }
    }
    
    .cache-notice {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
      padding: 14px 20px;
      background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
      border-radius: var(--radius-lg);
      color: var(--accent-dark);
      font-size: 14px;
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    
    .empty-illustration {
      width: 160px;
      height: 160px;
      margin: 0 auto 24px;
      
      svg {
        width: 100%;
        height: 100%;
      }
    }
    
    .empty-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 8px;
    }
    
    .empty-desc {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0 0 24px;
    }
    
    .empty-btn {
      padding: 14px 32px;
      background: var(--gradient-primary);
      color: #fff;
      border: none;
      border-radius: var(--radius-lg);
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-normal);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
