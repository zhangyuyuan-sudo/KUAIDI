<template>
  <div class="search-form">
    <div class="sender-info-section">
      <div class="section-header">
        <div class="section-icon sender-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="section-title-group">
          <h3 class="section-title">寄件人信息</h3>
          <span class="section-badge">已预设</span>
        </div>
      </div>
      <div class="sender-info-card">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">姓名</span>
            <span class="info-value">党娅琪</span>
          </div>
          <div class="info-item">
            <span class="info-label">电话</span>
            <span class="info-value">18202797209</span>
          </div>
          <div class="info-item full-width">
            <span class="info-label">地址</span>
            <span class="info-value">广东省深圳市南山区大族科技中心1110</span>
          </div>
        </div>
      </div>
    </div>

    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="rules" 
      label-position="top"
      size="large"
    >
      <el-form-item label="收件地址" prop="receiverAddressText">
        <el-input
          v-model="form.receiverAddressText"
          type="textarea"
          :rows="6"
          clearable
          @focus="handleAddressFocus"
          placeholder="请输入收件人信息，包括姓名、电话、地址等"
          class="address-input"
        />
        
        <div class="notice-section">
          <div class="notice-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="notice-icon">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span class="notice-title">填写说明</span>
          </div>
          <ul class="notice-list">
            <li>发件人信息已预设，无需重复填写</li>
            <li>请填写收件人姓名、电话和完整地址</li>
            <li>如不指定重量，系统将默认为1kg</li>
          </ul>
        </div>
      </el-form-item>
      
      <div v-if="parsedAddress.province" class="parsed-address-card">
        <div class="parsed-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="check-icon">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span class="parsed-title">地址解析成功</span>
        </div>
        <div class="parsed-grid">
          <div class="parsed-item full">
            <span class="parsed-label">完整地址</span>
            <span class="parsed-value">{{ parsedAddress.province }}{{ parsedAddress.city }}{{ parsedAddress.district }}{{ parsedAddress.detail }}</span>
          </div>
          <div class="parsed-item" v-if="parsedAddress.name">
            <span class="parsed-label">收件人</span>
            <span class="parsed-value">{{ parsedAddress.name }}</span>
          </div>
          <div class="parsed-item" v-if="parsedAddress.phone">
            <span class="parsed-label">电话</span>
            <span class="parsed-value">{{ parsedAddress.phone }}</span>
          </div>
          <div class="parsed-item">
            <span class="parsed-label">重量</span>
            <span class="parsed-value">{{ form.weight }}kg</span>
          </div>
        </div>
      </div>
      
      <div class="form-row">
        <el-form-item label="包裹重量" prop="weight" class="weight-item">
          <div class="weight-input-wrapper">
            <el-input-number 
              v-model="form.weight"
              :min="0.1"
              :max="100"
              :precision="1"
              :step="0.5"
              controls-position="right"
            />
            <span class="weight-unit">kg</span>
          </div>
        </el-form-item>

        <el-form-item label="数据来源" prop="dataSource" class="source-item">
          <el-radio-group v-model="currentDataSource" size="default" class="source-radio">
            <el-radio-button 
              v-for="source in dataSources" 
              :key="source.value"
              :label="source.value"
              :disabled="!source.available"
            >
              {{ source.label }}
            </el-radio-button>
          </el-radio-group>
          <div class="source-tip" :class="{ active: currentDataSource === 'kuaidi100' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span v-if="currentDataSource === 'mock'">当前使用模拟数据，仅供演示</span>
            <span v-else>已接入快递100真实数据</span>
          </div>
        </el-form-item>
      </div>
      
      <el-form-item class="submit-item">
        <el-button 
          type="primary" 
          size="large"
          @click="handleSubmit"
          :loading="loading"
          class="submit-btn"
        >
          <template #icon>
            <svg v-if="!loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </template>
          {{ loading ? '查询中...' : '立即比价' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCourierStore } from '@/stores/courier'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useCourierStore()

const formRef = ref(null)
const form = ref({
  receiverAddressText: '',
  weight: 1
})

const parsedAddress = ref({
  province: '',
  city: '',
  district: '',
  detail: '',
  name: '',
  phone: ''
})

const isExampleData = ref(true)
const exampleText = `单个订单示例：
收件人：李四，电话：13900139000，地址：北京市海淀区中关村南大街5号，货物：电子产品，重量：2kg，价值：1000元

多个订单示例：
收件人：李四，电话：13900139000，地址：北京市海淀区中关村南大街5号，货物：电子产品，重量：2kg，价值：1000元
收件人：王五，电话：13700137000，公司：YY贸易有限公司，地址：上海市浦东新区张江高科技园区88号，货物：文件，重量：0.5kg`

const rules = {
  receiverAddressText: [
    { required: true, message: '请输入收件地址', trigger: 'blur' },
    { min: 10, message: '地址信息不完整', trigger: 'blur' }
  ],
  weight: [
    { required: true, message: '请输入重量', trigger: 'blur' }
  ]
}

const dataSources = ref([])
const loading = ref(false)

const currentDataSource = computed({
  get: () => store.currentDataSource,
  set: (value) => store.setDataSource(value)
})

function parseAddress(text) {
  if (!text || text.length < 5) {
    parsedAddress.value = { province: '', city: '', district: '', detail: '', name: '', phone: '' }
    return
  }

  const result = {
    province: '',
    city: '',
    district: '',
    detail: '',
    name: '',
    phone: ''
  }

  let originalText = text

  const phoneMatch = text.match(/(?:\+86\s*)?(1[3-9]\d{9})/)
  if (phoneMatch) {
    result.phone = phoneMatch[1]
    text = text.replace(phoneMatch[0], '')
    originalText = originalText.replace(phoneMatch[0], '')
  }
  
  text = text.replace(/\+86/g, '').trim()
  originalText = originalText.replace(/\+86/g, '').trim()

  const namePatterns = [
    /收件人[：:]\s*([^，,。\s]{2,4})/,
    /姓名[：:]\s*([^，,。\s]{2,4})/,
    /联系人[：:]\s*([^，,。\s]{2,4})/
  ]
  for (const pattern of namePatterns) {
    const match = text.match(pattern)
    if (match) {
      result.name = match[1]
      text = text.replace(match[0], '')
      originalText = originalText.replace(match[0], '')
      break
    }
  }

  if (!result.name) {
    const startNamePattern = /^\s*([\u4e00-\u9fa5]{2,4})\s*[，,\s]/
    const startMatch = originalText.match(startNamePattern)
    if (startMatch) {
      const possibleName = startMatch[1]
      if (/^[\u4e00-\u9fa5][\u4e00-\u9fa5]*(?:先生|女士|小姐)?$/.test(possibleName) && 
          !['北京', '上海', '天津', '重庆', '北京市', '上海市', '天津市', '重庆市'].includes(possibleName)) {
        result.name = possibleName
        text = text.replace(startMatch[0], '')
        originalText = originalText.replace(startMatch[0], '')
      }
    }
  }

  text = text.replace(/\s+/g, ' ').trim()

  const provincePattern = /(北京|上海|天津|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|台湾|内蒙古|广西|西藏|宁夏|新疆|香港|澳门)/
  const provinceMatch = text.match(provincePattern)
  if (provinceMatch) {
    const provinceName = provinceMatch[1]
    
    if (['北京', '上海', '天津', '重庆'].includes(provinceName)) {
      result.province = provinceName + '市'
      result.city = provinceName + '市'
    } else {
      result.province = provinceName + '省'
    }
    text = text.replace(provinceMatch[0], '')
  }

  if (!result.city) {
    const cityPattern = /([^省]+?市|[^省]+?自治州|[^省]+?地区|[^省]+?盟)/
    const cityMatch = text.match(cityPattern)
    if (cityMatch) {
      const cityName = cityMatch[1]
      if (['北京市', '上海市', '天津市', '重庆市'].includes(cityName) && result.province === cityName) {
        text = text.replace(cityMatch[0], '')
      } else {
        result.city = cityName
        text = text.replace(cityMatch[0], '')
      }
    }
  }

  const districtPattern = /([^市区县]+?[区县])/  
  const districtMatch = text.match(districtPattern)
  if (districtMatch) {
    result.district = districtMatch[1]
    text = text.replace(districtMatch[0], '')
  }

  result.detail = text.replace(/[，,。\s]+/g, ' ').trim()
  
  const provinceBase = result.province.replace(/省|市|自治区|特别行政区/, '')
  const cityBase = result.city ? result.city.replace(/市|自治州|地区|盟/, '') : ''
  const districtBase = result.district ? result.district.replace(/区|县|市/, '') : ''
  
  const keywordsToRemove = []
  if (provinceBase) keywordsToRemove.push(provinceBase)
  if (cityBase && cityBase !== provinceBase) keywordsToRemove.push(cityBase)
  if (districtBase) keywordsToRemove.push(districtBase)
  
  let prevDetail = ''
  let maxLoops = 10
  
  while (prevDetail !== result.detail && maxLoops > 0) {
    prevDetail = result.detail
    maxLoops--
    
    for (const keyword of keywordsToRemove) {
      if (keyword) {
        const pattern1 = new RegExp(`^${keyword}[市区县]?\\s*`)
        const pattern2 = new RegExp(`^${keyword}\\s*`)
        result.detail = result.detail.replace(pattern1, '').trim()
        result.detail = result.detail.replace(pattern2, '').trim()
      }
    }
    
    if (result.detail.startsWith('市')) {
      result.detail = result.detail.substring(1).trim()
    }
  }
  
  result.detail = result.detail.replace(/\s+/g, ' ').trim()

  parsedAddress.value = result
}

let debounceTimer = null
watch(() => form.value.receiverAddressText, (newVal) => {
  if (isExampleData.value) return
  
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    parseAddress(newVal)
  }, 300)
})

onMounted(async () => {
  form.value.receiverAddressText = exampleText
  
  try {
    dataSources.value = await store.loadDataSources()
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
})

function handleAddressFocus() {
  if (isExampleData.value) {
    form.value.receiverAddressText = ''
    isExampleData.value = false
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (!parsedAddress.value.province || !parsedAddress.value.city) {
      ElMessage.warning('地址解析失败，请检查地址格式')
      return
    }
    
    if (!parsedAddress.value.name) {
      ElMessage.warning('未能解析到收件人姓名，请在地址中注明"收件人：姓名"')
      return
    }
    
    if (!parsedAddress.value.phone) {
      ElMessage.warning('未能解析到收件人电话，请在地址中注明电话号码')
      return
    }
    
    const params = {
      senderProvince: '广东省',
      senderCity: '深圳市',
      senderDistrict: '南山区',
      receiverProvince: parsedAddress.value.province,
      receiverCity: parsedAddress.value.city,
      receiverDistrict: parsedAddress.value.district || '',
      receiverDetail: parsedAddress.value.detail,
      receiverName: parsedAddress.value.name,
      receiverPhone: parsedAddress.value.phone,
      weight: form.value.weight
    }
    
    loading.value = true
    
    try {
      await store.compare(params)
      router.push('/result')
    } catch (error) {
      ElMessage.error('查询失败，请重试')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
    padding-bottom: 8px;
  }
  
  :deep(.el-textarea__inner) {
    border-radius: var(--radius-md);
    border: 2px solid var(--border-color);
    transition: all var(--transition-normal);
    font-size: 14px;
    line-height: 1.6;
    
    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }
  
  :deep(.el-input-number) {
    width: 160px;
    
    .el-input__wrapper {
      border-radius: var(--radius-md);
      border: 2px solid var(--border-color);
      
      &:hover, &:focus {
        border-color: var(--primary-color);
      }
    }
  }
  
  :deep(.el-radio-button__inner) {
    border-radius: var(--radius-md) !important;
    border: 2px solid var(--border-color);
    padding: 10px 20px;
    font-weight: 500;
    
    &:hover {
      color: var(--primary-color);
    }
  }
  
  :deep(.el-radio-button.is-active .el-radio-button__inner) {
    background: var(--gradient-primary);
    border-color: var(--primary-color);
    box-shadow: none;
  }

  .sender-info-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-light);

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .section-icon {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          width: 20px;
          height: 20px;
        }
        
        &.sender-icon {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: #fff;
        }
      }

      .section-title-group {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        
        .section-badge {
          padding: 4px 10px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          border-radius: var(--radius-full);
        }
      }
    }

    .sender-info-card {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border-radius: var(--radius-lg);
      padding: 16px 20px;
      border: 1px solid rgba(59, 130, 246, 0.2);

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        
        @media (max-width: 480px) {
          grid-template-columns: 1fr;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          
          &.full-width {
            grid-column: span 2;
            
            @media (max-width: 480px) {
              grid-column: span 1;
            }
          }

          .info-label {
            font-size: 12px;
            color: var(--text-muted);
            font-weight: 500;
          }

          .info-value {
            font-size: 14px;
            color: var(--text-primary);
            font-weight: 600;
          }
        }
      }
    }
  }

  .notice-section {
    margin-top: 12px;
    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: var(--radius-md);
    padding: 14px 16px;

    .notice-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;

      .notice-icon {
        width: 18px;
        height: 18px;
        color: var(--accent-color);
      }

      .notice-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--accent-dark);
      }
    }

    .notice-list {
      margin: 0;
      padding-left: 20px;
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.8;

      li {
        list-style-type: disc;
      }
    }
  }

  .parsed-address-card {
    background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: var(--radius-lg);
    padding: 16px 20px;
    margin-bottom: 20px;
    animation: fadeInUp 0.3s ease-out;

    .parsed-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;

      .check-icon {
        width: 20px;
        height: 20px;
        color: var(--success-color);
      }

      .parsed-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--success-color);
      }
    }

    .parsed-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      
      @media (max-width: 576px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .parsed-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        &.full {
          grid-column: span 3;
          
          @media (max-width: 576px) {
            grid-column: span 2;
          }
        }

        .parsed-label {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .parsed-value {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 600;
        }
      }
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .weight-item {
      .weight-input-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .weight-unit {
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
    
    .source-item {
      .source-radio {
        display: flex;
        gap: 8px;
      }
      
      .source-tip {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--text-muted);
        
        svg {
          width: 14px;
          height: 14px;
        }
        
        &.active {
          color: var(--success-color);
        }
      }
    }
  }

  .submit-item {
    margin-top: 8px;
    
    .submit-btn {
      width: 100%;
      height: 52px;
      font-size: 16px;
      font-weight: 600;
      border-radius: var(--radius-lg);
      background: var(--gradient-primary);
      border: none;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
      transition: all var(--transition-normal);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
