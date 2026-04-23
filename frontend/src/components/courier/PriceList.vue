<template>
  <div class="price-list">
    <div v-if="results.length === 0" class="empty-state">
      <div class="empty-illustration">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
          <rect x="70" y="60" width="60" height="80" rx="8" fill="#E5E7EB"/>
          <rect x="80" y="70" width="40" height="8" rx="2" fill="#D1D5DB"/>
          <rect x="80" y="85" width="30" height="6" rx="2" fill="#D1D5DB"/>
          <rect x="80" y="100" width="35" height="6" rx="2" fill="#D1D5DB"/>
          <circle cx="100" cy="130" r="8" fill="#9CA3AF"/>
        </svg>
      </div>
      <h3 class="empty-title">暂无查询结果</h3>
      <p class="empty-desc">请尝试调整查询条件</p>
    </div>
    
    <div v-else class="list-container">
      <div class="list-header">
        <div class="result-count">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span>共 <strong>{{ results.length }}</strong> 个快递公司可寄</span>
        </div>
        <div class="sort-options">
          <button 
            class="sort-btn" 
            :class="{ active: sortBy === 'price' }"
            @click="handleSort('price')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
            价格排序
          </button>
          <button 
            class="sort-btn" 
            :class="{ active: sortBy === 'time' }"
            @click="handleSort('time')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            时效排序
          </button>
        </div>
      </div>
      
      <transition-group name="card-list" tag="div" class="cards-grid">
        <PriceCard 
          v-for="(item, index) in sortedResults" 
          :key="item.courierCode"
          :item="item"
          class="card-item"
          :style="{ animationDelay: `${index * 0.08}s` }"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PriceCard from './PriceCard.vue'

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  }
})

const sortBy = ref('price')

const sortedResults = computed(() => {
  const sorted = [...props.results]
  if (sortBy.value === 'price') {
    sorted.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'time') {
    sorted.sort((a, b) => {
      const timeA = parseFloat(a.estimatedTime) || 999
      const timeB = parseFloat(b.estimatedTime) || 999
      return timeA - timeB
    })
  }
  return sorted
})

function handleSort(type) {
  sortBy.value = type
}
</script>

<style lang="scss" scoped>
.price-list {
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
      margin: 0;
    }
  }
  
  .list-container {
    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
      
      .result-count {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        color: #6B7280;
        
        svg {
          width: 20px;
          height: 20px;
          color: #9CA3AF;
        }
        
        strong {
          color: #1F2937;
          font-weight: 700;
        }
      }
      
      .sort-options {
        display: flex;
        gap: 8px;
        
        .sort-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.25s ease;
          
          svg {
            width: 16px;
            height: 16px;
          }
          
          &:hover {
            border-color: #2563EB;
            color: #2563EB;
            background: rgba(37, 99, 235, 0.04);
          }
          
          &.active {
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            border-color: transparent;
            color: #FFFFFF;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          }
        }
      }
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .card-item {
        animation: cardFadeIn 0.5s ease forwards;
        opacity: 0;
        transform: translateY(20px);
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.4s ease;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.card-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.card-list-move {
  transition: transform 0.4s ease;
}

@media (max-width: 480px) {
  .price-list .list-container .list-header {
    flex-direction: column;
    align-items: flex-start;
    
    .sort-options {
      width: 100%;
      
      .sort-btn {
        flex: 1;
        justify-content: center;
      }
    }
  }
}
</style>
