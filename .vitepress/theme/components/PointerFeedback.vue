<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type TrailPoint = { x: number; y: number; time: number }
type Ripple = { id: number; x: number; y: number }
const enabled = ref(false)
const halo = ref<HTMLElement>()
const dots = ref<HTMLElement[]>([])
const ripples = ref<Ripple[]>([])
const points: TrailPoint[] = []
const lifetime = 300
const pointLimit = 12
let pointerMedia: MediaQueryList | undefined
let motionMedia: MediaQueryList | undefined
let frame = 0
let serial = 0
let lastMove = 0
let x = 0
let y = 0
let interactive = false

function clear() {
  cancelAnimationFrame(frame)
  frame = 0
  points.length = 0
  ripples.value = []
  if (halo.value) halo.value.style.opacity = '0'
  for (const dot of dots.value) dot.style.opacity = '0'
}

function paint(now: number) {
  frame = 0
  while (points.length && now - points[0].time >= lifetime) points.shift()
  const activity = Math.max(0, 1 - (now - lastMove) / lifetime)
  if (halo.value) {
    halo.value.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${interactive ? 1.5 : 1})`
    halo.value.style.opacity = String(activity * (interactive ? 0.55 : 0.32))
  }
  dots.value.forEach((dot, index) => {
    const point = points[index]
    if (!point) { dot.style.opacity = '0'; return }
    const remaining = Math.max(0, 1 - (now - point.time) / lifetime)
    dot.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) scale(${0.35 + remaining * 0.65})`
    dot.style.opacity = String(remaining * 0.5)
  })
  // Stop rendering as soon as the pointer settles; no idle animation loop.
  if (activity > 0 || points.length) frame = requestAnimationFrame(paint)
}

function move(event: PointerEvent) {
  if (!enabled.value || event.pointerType !== 'mouse') return
  x = event.clientX
  y = event.clientY
  lastMove = performance.now()
  interactive = event.target instanceof Element && !!event.target.closest('a[href], button, summary, [role="button"], input, select, textarea')
  const previous = points[points.length - 1]
  if (!previous || Math.hypot(x - previous.x, y - previous.y) > 6) {
    points.push({ x, y, time: lastMove })
    if (points.length > pointLimit) points.shift()
  }
  if (!frame) frame = requestAnimationFrame(paint)
}

function press(event: PointerEvent) {
  if (!enabled.value || event.pointerType !== 'mouse' || event.button !== 0) return
  ripples.value = [...ripples.value.slice(-3), { id: ++serial, x: event.clientX, y: event.clientY }]
}
function removeRipple(id: number) { ripples.value = ripples.value.filter(ripple => ripple.id !== id) }
function leave(event: PointerEvent) { if (!event.relatedTarget) clear() }
function updateAvailability() {
  enabled.value = !!pointerMedia?.matches && !motionMedia?.matches
  if (!enabled.value) clear()
}
function visibilityChange() { if (document.hidden) clear() }

onMounted(() => {
  pointerMedia = matchMedia('(hover: hover) and (pointer: fine)')
  motionMedia = matchMedia('(prefers-reduced-motion: reduce)')
  updateAvailability()
  pointerMedia.addEventListener('change', updateAvailability)
  motionMedia.addEventListener('change', updateAvailability)
  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerdown', press, { passive: true })
  window.addEventListener('pointerout', leave, { passive: true })
  window.addEventListener('pointercancel', clear, { passive: true })
  window.addEventListener('scroll', clear, { passive: true })
  window.addEventListener('blur', clear)
  document.addEventListener('visibilitychange', visibilityChange)
})
onUnmounted(() => {
  clear()
  pointerMedia?.removeEventListener('change', updateAvailability)
  motionMedia?.removeEventListener('change', updateAvailability)
  window.removeEventListener('pointermove', move)
  window.removeEventListener('pointerdown', press)
  window.removeEventListener('pointerout', leave)
  window.removeEventListener('pointercancel', clear)
  window.removeEventListener('scroll', clear)
  window.removeEventListener('blur', clear)
  document.removeEventListener('visibilitychange', visibilityChange)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="enabled" class="ec-pointer-feedback" aria-hidden="true">
      <span v-for="index in pointLimit" :key="index" ref="dots" class="pointer-dot" />
      <span ref="halo" class="pointer-halo" />
      <span v-for="ripple in ripples" :key="ripple.id" class="pointer-ripple"
        :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }" @animationend="removeRipple(ripple.id)" />
    </div>
  </Teleport>
</template>

<style scoped>
.ec-pointer-feedback { position:fixed; inset:0; z-index:3000; overflow:hidden; pointer-events:none; color:var(--ec-accent); contain:strict; }
.ec-pointer-feedback * { pointer-events:none; }
.pointer-dot,.pointer-halo { position:absolute; top:0; left:0; opacity:0; will-change:transform,opacity; }
.pointer-dot { width:4px; height:4px; margin:-2px; border-radius:50%; background:currentColor; }
.pointer-halo { width:22px; height:22px; margin:-11px; border:1px solid currentColor; border-radius:50%; }
.pointer-ripple { position:absolute; width:40px; height:40px; margin:-20px; border:1.5px solid currentColor; border-radius:50%; background:var(--ec-accent-soft); animation:ec-pointer-click 520ms cubic-bezier(.2,.65,.3,1) both; }
@keyframes ec-pointer-click { from { transform:scale(.18); opacity:.65; } to { transform:scale(1.25); opacity:0; } }
@media(prefers-reduced-motion:reduce), (hover:none), (pointer:coarse) { .ec-pointer-feedback { display:none; } }
</style>
