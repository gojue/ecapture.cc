<template>
  <div class="carousel-section">
    <h2 class="carousel-title">{{ title }}</h2>
    <p class="carousel-subtitle">{{ subtitle }}</p>
    
    <div 
      class="carousel-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <button class="carousel-button prev" @click="prev">
        ←
      </button>
      
      <div class="carousel-content">
        <transition-group name="slide">
          <img 
            v-for="(image, index) in images" 
            :key="index"
            :src="image"
            v-show="index === currentIndex"
            :alt="`Slide ${index + 1}`"
            @click="openLightbox(index)"
          />
        </transition-group>
      </div>

      <button class="carousel-button next" @click="next">
        →
      </button>

      <div class="carousel-indicators">
        <span
          v-for="(_, index) in images"
          :key="index"
          :class="['indicator', { active: currentIndex === index }]"
          @click="currentIndex = index"
        />
      </div>
    </div>

    <!-- 灯箱组件 -->
    <div v-if="showLightbox" class="lightbox" @click="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">×</button>
      <button class="lightbox-prev" @click.stop="prevLightbox">←</button>
      <button class="lightbox-next" @click.stop="nextLightbox">→</button>
      <img :src="images[lightboxIndex]" :alt="`Lightbox image ${lightboxIndex + 1}`" @click.stop />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const currentIndex = ref(0)
let timer = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  currentIndex.value = currentIndex.value === 0 
    ? props.images.length - 1 
    : currentIndex.value - 1
}

// 自动轮播
const startAutoPlay = () => {
  stopAutoPlay()
  timer = setInterval(() => {
    next()
  }, 5000)
}

const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

// 鼠标悬停时暂停轮播
const handleMouseEnter = () => {
  stopAutoPlay()
}

const handleMouseLeave = () => {
  startAutoPlay()
}

// 灯箱功能
const showLightbox = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index) => {
  lightboxIndex.value = index
  showLightbox.value = true
  stopAutoPlay() // 打开灯箱时停止自动播放
}

const closeLightbox = () => {
  showLightbox.value = false
  startAutoPlay() // 关闭灯箱时恢复自动播放
}

const nextLightbox = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % props.images.length
}

const prevLightbox = () => {
  lightboxIndex.value = lightboxIndex.value === 0 
    ? props.images.length - 1 
    : lightboxIndex.value - 1
}
</script>

<style scoped>
.carousel-section {
  margin: 4rem auto;
  text-align: center;
}

.carousel-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.carousel-subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1000px; /* 增加最大宽度 */
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px; /* 圆角 */
  background: rgba(var(--vp-c-bg-rgb), 0.8); /* 半透明背景 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  border: 1px solid rgba(var(--vp-c-brand-rgb), 0.1);
}

.carousel-content {
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel-content img {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
  cursor: pointer;
}

.carousel-content img:hover {
  transform: scale(1.02);
}

/* 灯箱样式 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox img {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
}

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 1rem;
  cursor: pointer;
  border-radius: 4px;
}

.lightbox-prev {
  left: 20px;
}

.lightbox-next {
  right: 20px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--vp-c-brand);
  color: var(--vp-c-bg);
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.carousel-button:hover {
  opacity: 1;
}

.carousel-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-button.prev {
  left: 10px;
}

.carousel-button.next {
  right: 10px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-text-2);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.indicator.active {
  opacity: 1;
  background: var(--vp-c-brand);
}

.slide-enter-active,
.slide-leave-active {
  position: absolute;
  width: 100%;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style> 