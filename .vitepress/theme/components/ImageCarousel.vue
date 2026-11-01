<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ images: string[]; durations?: number[]; title: string; subtitle: string }>()
const { lang } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const labels = computed(() => zh.value
  ? ['TLS 明文', 'PCAPNG 捕获', 'GnuTLS / Wireshark', '会话密钥', 'HTTP/3 · QUIC']
  : ['TLS plaintext', 'PCAPNG capture', 'GnuTLS / Wireshark', 'Session keys', 'HTTP/3 · QUIC'])
const root = ref<HTMLElement>()
const tabs = ref<HTMLElement>()
const playButton = ref<HTMLButtonElement>()
const current = ref(0)
const paused = ref(false)
const hovered = ref(false)
const visible = ref(false)
const pageVisible = ref(true)
const loaded = ref(false)
const stopped = computed(() => paused.value || hovered.value || !visible.value || !pageVisible.value || !loaded.value)
let timer: ReturnType<typeof setTimeout> | undefined
let observer: IntersectionObserver | undefined
let motion: MediaQueryList | undefined

function showSlide(index: number) {
  if (!props.images.length) return
  const next = (index + props.images.length) % props.images.length
  if (next === current.value) return
  loaded.value = false
  current.value = next
}
function selectSlide(index: number) {
  paused.value = true
  showSlide(index)
}
function moveTab(event: KeyboardEvent, index: number) {
  const targets: Record<string, number> = {
    ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: props.images.length - 1,
  }
  if (!(event.key in targets)) return
  event.preventDefault()
  selectSlide(targets[event.key])
  tabs.value?.querySelectorAll('button')[current.value]?.focus()
}
function schedule() {
  clearTimeout(timer)
  if (stopped.value || props.images.length < 2) return
  timer = setTimeout(() => showSlide(current.value + 1), props.durations?.[current.value] || 5000)
}
function focusCarousel(event: FocusEvent) {
  if (event.target !== playButton.value) paused.value = true
}
function updateVisibility() { pageVisible.value = !document.hidden }
function updateMotion() { if (motion?.matches) paused.value = true }

watch([stopped, current, () => props.durations], schedule)
onMounted(() => {
  motion = matchMedia('(prefers-reduced-motion: reduce)')
  updateMotion()
  motion.addEventListener('change', updateMotion)
  document.addEventListener('visibilitychange', updateVisibility)
  updateVisibility()
  observer = new IntersectionObserver(([entry]) => { visible.value = entry.isIntersecting })
  if (root.value) observer.observe(root.value)
})
onUnmounted(() => {
  clearTimeout(timer)
  observer?.disconnect()
  motion?.removeEventListener('change', updateMotion)
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>

<template>
  <section v-if="images.length" id="showcase" ref="root" class="carousel-section" aria-labelledby="showcase-title"
    aria-roledescription="carousel" @mouseenter="hovered = true" @mouseleave="hovered = false" @focusin="focusCarousel">
    <header class="showcase-header">
      <div>
        <p class="ec-eyebrow">02 / {{ zh ? '实际捕获' : 'IN ACTION' }}</p>
        <h2 id="showcase-title">{{ title }}</h2>
        <p class="showcase-description">{{ subtitle }}</p>
      </div>
      <div class="showcase-controls">
        <button ref="playButton" class="play-control" type="button" :aria-pressed="paused" @click="paused = !paused">
          <span aria-hidden="true">{{ paused ? '▷' : 'Ⅱ' }}</span>
          {{ zh ? (paused ? '播放轮播' : '暂停轮播') : (paused ? 'Play slideshow' : 'Pause slideshow') }}
        </button>
        <span class="showcase-counter" aria-hidden="true">{{ String(current + 1).padStart(2, '0') }} / {{ String(images.length).padStart(2, '0') }}</span>
        <button class="arrow-control" type="button" :aria-label="zh ? '上一张演示图' : 'Previous slide'" @click="selectSlide(current - 1)">←</button>
        <button class="arrow-control" type="button" :aria-label="zh ? '下一张演示图' : 'Next slide'" @click="selectSlide(current + 1)">→</button>
      </div>
    </header>
    <div ref="tabs" class="showcase-tabs" role="tablist" :aria-label="title">
      <button v-for="(_, index) in images" :id="`capture-tab-${index}`" :key="index" role="tab"
        :aria-selected="current === index" aria-controls="capture-showcase" type="button"
        :tabindex="current === index ? 0 : -1" @click="selectSlide(index)" @keydown="moveTab($event, index)">
        {{ labels[index] || `Demo ${index + 1}` }}
      </button>
    </div>
    <div id="capture-showcase" class="showcase-stage" role="tabpanel" :aria-labelledby="`capture-tab-${current}`" :aria-live="paused ? 'polite' : 'off'">
      <a :href="images[current]" target="_blank" rel="noopener noreferrer" :aria-label="zh ? '查看原图' : 'View full image'">
        <img :key="images[current]" :src="images[current]" :alt="labels[current] || `Demo ${current + 1}`" loading="lazy" @load="loaded = true" />
      </a>
    </div>
    <p class="showcase-hint">{{ zh ? '点击演示图查看原图' : 'Open a slide to view the full image' }} <span aria-hidden="true">↗</span></p>
  </section>
</template>

<style scoped>
.carousel-section { max-width:1320px; margin:0 auto; padding:0 36px 48px; scroll-margin-top:100px; }
.showcase-header { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; padding-top:36px; border-top:1px solid var(--ec-border); margin-bottom:24px; }
.ec-eyebrow { margin:0 0 12px; }
h2 { margin:0 0 12px; color:var(--ec-ink); font-size:32px; line-height:1.3; font-weight:700; letter-spacing:-.03em; }
.showcase-description { margin:0; font-size:14px; line-height:1.8; color:var(--ec-muted); }
.showcase-controls { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.showcase-controls button { min-height:40px; border:1px solid var(--ec-border); border-radius:4px; color:var(--ec-ink); cursor:pointer; background:var(--ec-bg); }
.showcase-controls button:hover { color:var(--ec-accent); border-color:var(--ec-accent); }
.play-control { display:flex; align-items:center; gap:8px; padding:0 12px; font-size:12px; }
.arrow-control { width:40px; font-size:18px; }
.showcase-counter { padding:0 8px; font:11px var(--vt-font-family-mono); color:var(--ec-muted); }
.showcase-tabs { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
.showcase-tabs button { padding:9px 14px; min-height:40px; border:1px solid var(--ec-border); border-radius:4px; font-size:12px; color:var(--ec-text); cursor:pointer; }
.showcase-tabs button[aria-selected=true] { color:var(--ec-accent); border-color:var(--ec-accent); background:var(--ec-accent-soft); }
.showcase-stage { width:100%; aspect-ratio:16 / 9; max-height:620px; border:1px solid var(--ec-border); border-radius:5px; overflow:hidden; background:var(--ec-code); }
.showcase-stage a { display:block; width:100%; height:100%; }
.showcase-stage a:focus-visible { outline-offset:-5px; }
.showcase-stage img { display:block; width:100%; height:100%; object-fit:contain; }
.showcase-hint { text-align:right; margin:12px 0 0; font-size:11px; color:var(--ec-muted); }
@media(max-width:960px) { .showcase-header { align-items:flex-start; flex-direction:column; } }
@media(max-width:760px) { .carousel-section { padding-inline:24px; } h2 { font-size:28px; } .showcase-controls { width:100%; } .play-control { margin-right:auto; } .showcase-tabs button { padding-inline:10px; } }
</style>
