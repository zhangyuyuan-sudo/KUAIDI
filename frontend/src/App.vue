<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
import { onErrorCaptured, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasError = ref(false)

onErrorCaptured((error, instance, info) => {
  console.error('Vue 错误:', error)
  console.error('组件:', instance)
  console.error('错误信息:', info)
  
  if (!hasError.value) {
    hasError.value = true
    router.push('/error?code=500&message=' + encodeURIComponent(error.message || '组件渲染错误'))
  }
  
  return false
})
</script>

<style lang="scss">
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
