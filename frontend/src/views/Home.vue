<template>
  <div class="home-page">
    <header class="header">
      <div class="header-bg"></div>
      <div class="container">
        <nav class="nav">
          <div class="logo">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8L12 3L4 8V20H8V14H16V20H20V8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 20H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="logo-text">快递比价</span>
          </div>
          <div class="nav-links">
            <router-link to="/orders" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              我的订单
            </router-link>
          </div>
        </nav>
        
        <div class="hero">
          <div class="hero-content">
            <h1 class="hero-title">
              <span class="title-line">智能比价</span>
              <span class="title-line accent">省钱省心</span>
            </h1>
            <p class="hero-subtitle">
              一键查询9家主流快递公司价格，快速找到最优选择
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-value">9</span>
                <span class="stat-label">家快递公司</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">实时</span>
                <span class="stat-label">价格更新</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">100%</span>
                <span class="stat-label">价格透明</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="floating-card card-1">
              <div class="mini-logo sf">顺</div>
              <span class="mini-price">¥12.00</span>
            </div>
            <div class="floating-card card-2">
              <div class="mini-logo yt">圆</div>
              <span class="mini-price">¥8.00</span>
            </div>
            <div class="floating-card card-3">
              <div class="mini-logo zt">中</div>
              <span class="mini-price">¥7.50</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <div class="form-section">
          <div class="form-card glass-card">
            <div class="form-header">
              <div class="form-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <div class="form-title-group">
                <h2 class="form-title">快递价格查询</h2>
                <p class="form-subtitle">输入收件信息，立即获取最优价格</p>
              </div>
            </div>
            <SearchForm />
          </div>
        </div>
        
        <section class="features-section">
          <div class="section-header">
            <h2 class="section-title">为什么选择我们</h2>
            <p class="section-subtitle">专业、快速、可靠的快递比价服务</p>
          </div>
          
          <div class="features-grid">
            <div class="feature-card" v-for="(feature, index) in features" :key="index">
              <div class="feature-icon" :style="{ background: feature.gradient }">
                <component :is="feature.icon" />
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.desc }}</p>
            </div>
          </div>
        </section>
        
        <section class="couriers-section">
          <div class="section-header">
            <h2 class="section-title">支持的快递公司</h2>
            <p class="section-subtitle">覆盖主流快递品牌，满足不同需求</p>
          </div>
          
          <div class="couriers-grid">
            <div class="courier-badge" v-for="courier in couriers" :key="courier.code" :style="{ borderColor: courier.color }">
              <div class="courier-icon" :style="{ background: courier.color }">
                {{ courier.name.charAt(0) }}
              </div>
              <span class="courier-name">{{ courier.name }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8L12 3L4 8V20H8V14H16V20H20V8Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span>快递比价</span>
          </div>
          <p class="footer-text">让寄件更简单、更省钱</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchForm from '@/components/courier/SearchForm.vue'

const features = ref([
  {
    icon: 'TimerIcon',
    title: '快速比价',
    desc: '一键查询多家快递价格，3秒出结果',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
  },
  {
    icon: 'CompareIcon',
    title: '多家对比',
    desc: '支持9家主流快递公司，覆盖全国',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  },
  {
    icon: 'CheckIcon',
    title: '实时准确',
    desc: '价格实时更新，数据准确可靠',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  },
  {
    icon: 'ShieldIcon',
    title: '安全可靠',
    desc: '官方接口对接，信息安全有保障',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  }
])

const couriers = ref([
  { code: 'sf', name: '顺丰速运', color: '#FF6B00' },
  { code: 'yt', name: '圆通速递', color: '#E53935' },
  { code: 'zt', name: '中通快递', color: '#1E88E5' },
  { code: 'yd', name: '韵达快递', color: '#FF9800' },
  { code: 'st', name: '申通快递', color: '#4CAF50' },
  { code: 'jt', name: '极兔速递', color: '#E91E63' },
  { code: 'jd', name: '京东快递', color: '#E1251B' },
  { code: 'db', name: '德邦快递', color: '#9C27B0' },
  { code: 'ems', name: 'EMS', color: '#00BCD4' }
])
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.header {
  position: relative;
  padding: 0 0 80px;
  overflow: hidden;
  
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 420px;
    background: var(--gradient-hero);
    border-radius: 0 0 60px 60px;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
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
      gap: 12px;
      color: #fff;
      
      .logo-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          width: 24px;
          height: 24px;
        }
      }
      
      .logo-text {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
    }
    
    .nav-links {
      display: flex;
      gap: 8px;
      
      .nav-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        border-radius: var(--radius-full);
        background: rgba(255, 255, 255, 0.1);
        transition: all var(--transition-normal);
        
        svg {
          width: 18px;
          height: 18px;
        }
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
      }
    }
  }
  
  .hero {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 0;
    gap: 40px;
    
    @media (max-width: 1024px) {
      flex-direction: column;
      text-align: center;
    }
    
    .hero-content {
      flex: 1;
      
      .hero-title {
        margin: 0 0 16px;
        line-height: 1.1;
        
        .title-line {
          display: block;
          font-size: 48px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -1px;
          
          @media (max-width: 768px) {
            font-size: 36px;
          }
          
          &.accent {
            background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
      }
      
      .hero-subtitle {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0 0 32px;
        max-width: 400px;
        
        @media (max-width: 1024px) {
          margin: 0 auto 32px;
        }
      }
      
      .hero-stats {
        display: flex;
        align-items: center;
        gap: 24px;
        
        @media (max-width: 1024px) {
          justify-content: center;
        }
        
        @media (max-width: 480px) {
          flex-direction: column;
          gap: 16px;
        }
        
        .stat-item {
          text-align: center;
          
          .stat-value {
            display: block;
            font-size: 28px;
            font-weight: 700;
            color: #fff;
          }
          
          .stat-label {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
          }
        }
        
        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          
          @media (max-width: 480px) {
            display: none;
          }
        }
      }
    }
    
    .hero-visual {
      position: relative;
      width: 280px;
      height: 200px;
      
      @media (max-width: 1024px) {
        display: none;
      }
      
      .floating-card {
        position: absolute;
        background: #fff;
        border-radius: var(--radius-lg);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: var(--shadow-xl);
        animation: float 3s ease-in-out infinite;
        
        .mini-logo {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          
          &.sf { background: #FF6B00; }
          &.yt { background: #E53935; }
          &.zt { background: #1E88E5; }
        }
        
        .mini-price {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        &.card-1 {
          top: 0;
          left: 0;
          animation-delay: 0s;
        }
        
        &.card-2 {
          top: 60px;
          right: 0;
          animation-delay: 0.5s;
        }
        
        &.card-3 {
          bottom: 0;
          left: 40px;
          animation-delay: 1s;
        }
      }
    }
  }
}

.main-content {
  flex: 1;
  margin-top: -40px;
  position: relative;
  z-index: 20;
  padding-bottom: 60px;
  
  .form-section {
    margin-bottom: 80px;
    
    .form-card {
      max-width: 680px;
      margin: 0 auto;
      padding: 32px;
      
      @media (max-width: 768px) {
        padding: 24px;
        margin: 0 16px;
        border-radius: var(--radius-lg);
      }
      
      .form-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 28px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-light);
        
        .form-icon {
          width: 48px;
          height: 48px;
          background: var(--gradient-primary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          
          svg {
            width: 24px;
            height: 24px;
            color: #fff;
          }
        }
        
        .form-title-group {
          .form-title {
            font-size: 22px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 4px;
          }
          
          .form-subtitle {
            font-size: 14px;
            color: var(--text-muted);
            margin: 0;
          }
        }
      }
    }
  }
  
  .features-section {
    margin-bottom: 80px;
    
    .section-header {
      text-align: center;
      margin-bottom: 48px;
      
      .section-title {
        font-size: 32px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 12px;
        
        @media (max-width: 768px) {
          font-size: 26px;
        }
      }
      
      .section-subtitle {
        font-size: 16px;
        color: var(--text-secondary);
        margin: 0;
      }
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      
      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
      
      .feature-card {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: 32px 24px;
        text-align: center;
        border: 1px solid var(--border-light);
        transition: all var(--transition-normal);
        
        &:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }
        
        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
          color: #fff;
        }
        
        .feature-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px;
        }
        
        .feature-desc {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
        }
      }
    }
  }
  
  .couriers-section {
    .section-header {
      text-align: center;
      margin-bottom: 40px;
      
      .section-title {
        font-size: 32px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 12px;
        
        @media (max-width: 768px) {
          font-size: 26px;
        }
      }
      
      .section-subtitle {
        font-size: 16px;
        color: var(--text-secondary);
        margin: 0;
      }
    }
    
    .couriers-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      
      .courier-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        background: var(--bg-primary);
        border-radius: var(--radius-full);
        border: 2px solid transparent;
        transition: all var(--transition-normal);
        
        &:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-md);
        }
        
        .courier-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
        }
        
        .courier-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
      }
    }
  }
}

.footer {
  background: var(--bg-dark);
  padding: 40px 0;
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      
      .footer-logo {
        width: 32px;
        height: 32px;
        
        svg {
          width: 100%;
          height: 100%;
        }
      }
      
      span {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .footer-text {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
</style>
