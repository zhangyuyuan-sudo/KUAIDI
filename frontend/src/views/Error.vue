<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-illustration">
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="200" cy="280" rx="150" ry="15" fill="#E5E7EB"/>
          <rect x="80" y="80" width="240" height="180" rx="12" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="2"/>
          <rect x="100" y="60" width="200" height="30" rx="6" fill="#E5E7EB"/>
          <circle cx="120" cy="75" r="6" fill="#EF4444"/>
          <circle cx="140" cy="75" r="6" fill="#F59E0B"/>
          <circle cx="160" cy="75" r="6" fill="#10B981"/>
          <rect x="110" y="110" width="180" height="20" rx="4" fill="#E5E7EB"/>
          <rect x="110" y="145" width="140" height="15" rx="3" fill="#D1D5DB"/>
          <rect x="110" y="170" width="160" height="15" rx="3" fill="#D1D5DB"/>
          <rect x="110" y="195" width="100" height="15" rx="3" fill="#D1D5DB"/>
          <g class="error-icon">
            <circle cx="300" cy="200" r="40" fill="#FEE2E2"/>
            <path d="M285 185L315 215M315 185L285 215" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
          </g>
        </svg>
      </div>
      
      <div class="error-content">
        <h1 class="error-code">{{ errorCode }}</h1>
        <h2 class="error-title">{{ errorTitle }}</h2>
        <p class="error-message">{{ errorMessage }}</p>
        
        <div class="error-actions">
          <button class="btn-primary" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回上一页
          </button>
          <button class="btn-secondary" @click="goHome">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            返回首页
          </button>
        </div>
        
        <div class="error-tips">
          <h4>可能的原因：</h4>
          <ul>
            <li v-for="(tip, index) in errorTips" :key="index">{{ tip }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const errorConfig = {
  404: {
    title: '页面未找到',
    message: '抱歉，您访问的页面不存在或已被移除',
    tips: [
      '页面地址可能已被更改',
      '页面可能已被删除',
      '请检查输入的网址是否正确'
    ]
  },
  500: {
    title: '服务器错误',
    message: '抱歉，服务器遇到了问题，请稍后再试',
    tips: [
      '服务器可能正在维护',
      '网络连接可能不稳定',
      '请稍后刷新页面重试'
    ]
  },
  403: {
    title: '访问被拒绝',
    message: '抱歉，您没有权限访问此页面',
    tips: [
      '您可能需要登录后访问',
      '您的账号权限不足',
      '请联系管理员获取权限'
    ]
  },
  408: {
    title: '请求超时',
    message: '抱歉，请求超时，请检查网络连接',
    tips: [
      '网络连接可能不稳定',
      '服务器响应时间过长',
      '请检查您的网络设置'
    ]
  },
  network: {
    title: '网络错误',
    message: '抱歉，网络连接失败，请检查您的网络',
    tips: [
      '请检查网络连接是否正常',
      '请检查防火墙设置',
      '请尝试刷新页面'
    ]
  }
}

const errorCode = computed(() => {
  return route.query.code || '404'
})

const errorTitle = computed(() => {
  const config = errorConfig[errorCode.value] || errorConfig[404]
  return config.title
})

const errorMessage = computed(() => {
  const config = errorConfig[errorCode.value] || errorConfig[404]
  return route.query.message || config.message
})

const errorTips = computed(() => {
  const config = errorConfig[errorCode.value] || errorConfig[404]
  return config.tips
})

function goBack() {
  router.go(-1)
}

function goHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0F9FF 100%);
  padding: 40px 20px;
  
  .error-container {
    max-width: 600px;
    width: 100%;
    text-align: center;
    
    .error-illustration {
      margin-bottom: 40px;
      
      svg {
        width: 100%;
        max-width: 400px;
        height: auto;
        
        .error-icon {
          animation: pulse 2s ease-in-out infinite;
        }
      }
    }
    
    .error-content {
      .error-code {
        font-size: 72px;
        font-weight: 800;
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 16px 0;
        line-height: 1;
        letter-spacing: -0.02em;
      }
      
      .error-title {
        font-size: 28px;
        font-weight: 700;
        color: #1F2937;
        margin: 0 0 12px 0;
      }
      
      .error-message {
        font-size: 16px;
        color: #6B7280;
        margin: 0 0 32px 0;
        line-height: 1.6;
      }
      
      .error-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin-bottom: 40px;
        
        button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          
          svg {
            width: 18px;
            height: 18px;
          }
          
          &.btn-primary {
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            color: #FFFFFF;
            border: none;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
            }
          }
          
          &.btn-secondary {
            background: #FFFFFF;
            color: #374151;
            border: 1px solid #E5E7EB;
            
            &:hover {
              background: #F9FAFB;
              border-color: #D1D5DB;
            }
          }
        }
      }
      
      .error-tips {
        background: #FFFFFF;
        border-radius: 16px;
        padding: 24px;
        text-align: left;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        border: 1px solid #F3F4F6;
        
        h4 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px 0;
        }
        
        ul {
          margin: 0;
          padding: 0;
          list-style: none;
          
          li {
            position: relative;
            padding-left: 20px;
            font-size: 14px;
            color: #6B7280;
            line-height: 1.8;
            
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 10px;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #3B82F6;
            }
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@media (max-width: 640px) {
  .error-page {
    .error-container {
      .error-content {
        .error-code {
          font-size: 56px;
        }
        
        .error-title {
          font-size: 22px;
        }
        
        .error-actions {
          flex-direction: column;
          
          button {
            width: 100%;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
