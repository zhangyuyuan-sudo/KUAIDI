<template>
  <div class="price-card" :class="{ 'lowest': item.isLowest, 'fastest': item.isFastest }">
    <div v-if="item.isLowest || item.isFastest" class="recommend-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path v-if="item.isLowest" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        <path v-else d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      {{ item.isLowest ? '最便宜' : '最快送达' }}
    </div>
    
    <div class="card-header">
      <div class="courier-info">
        <div class="courier-logo" :style="{ background: getLogoGradient(item.courierCode) }">
          <span class="logo-text">{{ item.courierName.charAt(0) }}</span>
        </div>
        <div class="courier-detail">
          <h3 class="courier-name">{{ item.courierName }}</h3>
          <span class="service-type">{{ item.serviceType }}</span>
        </div>
      </div>
      <div v-if="item.isLowest" class="save-tag">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        省钱首选
      </div>
    </div>
    
    <div class="card-body">
      <div class="price-section">
        <div class="price-main">
          <div class="current-price">
            <span class="currency">¥</span>
            <span class="amount">{{ item.price.toFixed(2) }}</span>
          </div>
          <div v-if="item.originalPrice > item.price" class="price-compare">
            <span class="original-price">¥{{ item.originalPrice.toFixed(2) }}</span>
            <span class="discount-rate">
              省¥{{ (item.originalPrice - item.price).toFixed(2) }}
            </span>
          </div>
        </div>
        <div v-if="item.discount" class="discount-tag">
          {{ item.discount }}
        </div>
      </div>
      
      <div class="info-section">
        <div class="info-item time">
          <div class="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="info-content">
            <span class="info-label">预计送达</span>
            <span class="info-value">{{ item.estimatedTime }}</span>
          </div>
        </div>
        <div v-if="item.remark" class="info-item remark">
          <div class="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <span class="info-text">{{ item.remark }}</span>
        </div>
      </div>
      
      <div class="action-section">
        <button class="order-btn" @click="handleOrder">
          <span class="btn-text">立即下单</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-arrow">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCourierStore } from '@/stores/courier'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const store = useCourierStore()

function handleOrder() {
  store.setSelectedCourier(props.item)
  router.push('/order/confirm')
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
</script>

<style lang="scss" scoped>
.price-card {
  background: var(--bg-primary, #FFFFFF);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #E5E7EB 0%, #E5E7EB 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    
    .order-btn {
      transform: scale(1.02);
    }
  }
  
  &.lowest {
    border: 2px solid #10B981;
    background: linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, #FFFFFF 100%);
    
    &::before {
      background: linear-gradient(90deg, #10B981 0%, #34D399 100%);
      opacity: 1;
    }
    
    .recommend-badge {
      background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
      color: #FFFFFF;
    }
    
    .price-section .amount {
      color: #10B981;
    }
  }
  
  &.fastest {
    border: 2px solid #3B82F6;
    background: linear-gradient(180deg, rgba(59, 130, 246, 0.04) 0%, #FFFFFF 100%);
    
    &::before {
      background: linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%);
      opacity: 1;
    }
    
    .recommend-badge {
      background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
      color: #FFFFFF;
    }
    
    .price-section .amount {
      color: #3B82F6;
    }
  }
  
  .recommend-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
    color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
  
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .courier-info {
      display: flex;
      align-items: center;
      gap: 14px;
      
      .courier-logo {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        
        .logo-text {
          color: #FFFFFF;
          font-size: 24px;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
      }
      
      .courier-detail {
        .courier-name {
          font-size: 20px;
          font-weight: 700;
          color: #1F2937;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }
        
        .service-type {
          font-size: 13px;
          color: #6B7280;
          font-weight: 500;
        }
      }
    }
    
    .save-tag {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: rgba(16, 185, 129, 0.1);
      color: #10B981;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      
      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
  
  .card-body {
    .price-section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #F3F4F6;
      
      .price-main {
        display: flex;
        align-items: flex-end;
        gap: 12px;
        flex-wrap: wrap;
      }
      
      .current-price {
        display: flex;
        align-items: baseline;
        gap: 2px;
        
        .currency {
          font-size: 20px;
          color: #F59E0B;
          font-weight: 600;
        }
        
        .amount {
          font-size: 40px;
          color: #F59E0B;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
        }
      }
      
      .price-compare {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        
        .original-price {
          font-size: 14px;
          color: #9CA3AF;
          text-decoration: line-through;
        }
        
        .discount-rate {
          font-size: 12px;
          color: #10B981;
          font-weight: 600;
          padding: 2px 6px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 4px;
        }
      }
      
      .discount-tag {
        display: inline-flex;
        align-items: center;
        margin-top: 10px;
        padding: 4px 10px;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%);
        color: #D97706;
        font-size: 12px;
        font-weight: 600;
        border-radius: 6px;
        border: 1px solid rgba(245, 158, 11, 0.2);
      }
    }
    
    .info-section {
      margin-bottom: 20px;
      
      .info-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          
          svg {
            width: 18px;
            height: 18px;
            color: #6B7280;
          }
        }
        
        .info-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          
          .info-label {
            font-size: 12px;
            color: #9CA3AF;
          }
          
          .info-value {
            font-size: 15px;
            color: #1F2937;
            font-weight: 600;
          }
        }
        
        &.time {
          .info-icon {
            background: rgba(59, 130, 246, 0.1);
            
            svg {
              color: #3B82F6;
            }
          }
        }
        
        &.remark {
          .info-icon {
            background: rgba(245, 158, 11, 0.1);
            
            svg {
              color: #F59E0B;
            }
          }
          
          .info-text {
            font-size: 13px;
            color: #6B7280;
            line-height: 1.5;
            padding-top: 8px;
          }
        }
      }
    }
    
    .action-section {
      .order-btn {
        width: 100%;
        padding: 14px 24px;
        border-radius: 12px;
        background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
        border: none;
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
        
        .btn-arrow {
          width: 18px;
          height: 18px;
          transition: transform 0.3s ease;
        }
        
        &:hover {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          
          .btn-arrow {
            transform: translateX(4px);
          }
        }
        
        &:active {
          transform: scale(0.98);
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .price-card {
    padding: 20px;
    border-radius: 16px;
    
    .card-header .courier-info {
      .courier-logo {
        width: 48px;
        height: 48px;
        
        .logo-text {
          font-size: 20px;
        }
      }
      
      .courier-detail .courier-name {
        font-size: 18px;
      }
    }
    
    .card-body .price-section .current-price .amount {
      font-size: 32px;
    }
  }
}
</style>
