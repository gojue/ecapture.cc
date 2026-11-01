<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
defineProps<{ zh: boolean }>()
const root = ref<HTMLElement>()
const paused = ref(false)
const ready = ref(false)
const visible = ref(false)
const pageVisible = ref(true)
const stopped = computed(() => paused.value || !ready.value || !visible.value || !pageVisible.value)
const tracks = [
  { x:202, y:111, duration:2.98, offset:.12 },
  { x:225, y:121, duration:3.34, offset:.49 },
  { x:248, y:110, duration:3.12, offset:.79 },
  { x:271, y:101, duration:3.52, offset:.30 },
  { x:294, y:111, duration:3.22, offset:.64 },
]
let observer: IntersectionObserver | undefined
let media: MediaQueryList | undefined
const updateMotion = () => { paused.value = media?.matches ?? false }
const updateVisibility = () => { pageVisible.value = !document.hidden }
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotion()
  media.addEventListener('change', updateMotion)
  document.addEventListener('visibilitychange', updateVisibility)
  updateVisibility()
  observer = new IntersectionObserver(([entry]) => { visible.value = entry.isIntersecting })
  if (root.value) observer.observe(root.value)
  ready.value = true
})
onUnmounted(() => {
  observer?.disconnect()
  media?.removeEventListener('change', updateMotion)
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>
<template>
  <figure ref="root" class="capture-flow" :class="{ 'is-stopped': stopped }">
<svg class="ec-diagram" viewBox="0 0 500 540" role="img" :aria-label="zh ? 'APPLICATION、TLS LIBRARY、KERNEL 三层的数据流示意' : 'Data flowing through application, TLS library and kernel layers'">
      <defs>
        <linearGradient id="ec-flow-tail" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="-3">
          <stop offset="0" stop-color="#FFCC1A" stop-opacity="0" />
          <stop offset="1" stop-color="#FFCC1A" stop-opacity="0.75" />
        </linearGradient>
        <clipPath id="ec-flow-clip"><path d="M188 102 H316 V438 H188 Z" /></clipPath>
      </defs>

      <g class="ec-planes">
        <g transform="translate(0 308)">
          <path class="ec-plane-face" d="M64 112 246 36 418 111 236 189Z" />
          <path class="ec-plane-edge" d="M64 112V125L236 202 418 124V111M236 189V202" />
          <path class="ec-grid" d="M109 132 290 55M154 152 333 74M196 171 375 92M110 93 283 169M156 74 328 149M201 55 373 129" />
          <g class="ec-chip">
            <path class="ec-cube-top" d="M208 83 254 64 302 84 256 104Z" />
            <path class="ec-cube-side" d="M208 83V112L256 133V104ZM256 104 302 84V113L256 133" />
          </g>
          <text class="ec-layer-label" x="64" y="151" transform="rotate(24 64 151)">KERNEL</text>
        </g>
        <g transform="translate(0 154)">
          <path class="ec-plane-face" d="M64 112 246 36 418 111 236 189Z" />
          <path class="ec-plane-edge" d="M64 112V125L236 202 418 124V111M236 189V202" />
          <path class="ec-grid" d="M109 132 290 55M154 152 333 74M196 171 375 92M110 93 283 169M156 74 328 149M201 55 373 129" />
          <path class="ec-cube-top" d="M207 76 254 56 302 77 255 98Z" />
          <path class="ec-cube-side" d="M207 76V121L255 142V98ZM255 98 302 77V121L255 142" />
          <text class="ec-cube-label" x="223" y="113" transform="rotate(24 223 113)">TLS</text>
          <text class="ec-layer-label" x="64" y="151" transform="rotate(24 64 151)">TLS LIBRARY</text>
        </g>
        <g>
          <path class="ec-plane-face" d="M64 112 246 36 418 111 236 189Z" />
          <path class="ec-plane-edge" d="M64 112V125L236 202 418 124V111M236 189V202" />
          <path class="ec-grid" d="M109 132 290 55M154 152 333 74M196 171 375 92M110 93 283 169M156 74 328 149M201 55 373 129" />
          <path class="ec-cube-top" d="M207 76 254 56 302 77 255 98Z" />
          <path class="ec-cube-side" d="M207 76V121L255 142V98ZM255 98 302 77V121L255 142" />
          <path class="ec-cube-top" d="M314 93 346 79 375 93 343 107Z" />
          <path class="ec-cube-side" d="M314 93V120L343 134V107ZM343 107 375 93V120L343 134" />
          <text class="ec-layer-label" x="64" y="151" transform="rotate(24 64 151)">APPLICATION</text>
        </g>
      </g>

      <g class="ec-tracks" aria-hidden="true">
        <path d="M202 111V419" />
        <path d="M225 121V429" />
        <path d="M248 110V418" />
        <path d="M271 101V409" />
        <path d="M294 111V419" />
      </g>
      <g class="ec-particles" clip-path="url(#ec-flow-clip)" aria-hidden="true">
        <g v-for="(track, trackIndex) in tracks" :key="trackIndex">
          <g v-for="packet in 2" :key="packet" class="ec-packet" :style="{ animationDuration: `${track.duration}s`, animationDelay: `${-(track.offset + (packet - 1) * .5) * track.duration}s` }">
            <svg :x="track.x - 7" :y="track.y - 24" width="14" height="32" viewBox="-7 -24 14 32" overflow="visible">
              <path class="ec-tail" d="M0 -20V-3" />
              <circle class="ec-dot-halo" r="6" />
              <circle class="ec-dot" r="2.5" />
            </svg>
          </g>
        </g>
      </g>

      <g class="ec-probe" aria-hidden="true">
        <path class="ec-branch" d="M294 282H326L351 267H434" />
        <circle class="ec-probe-halo" cx="294" cy="282" r="10" />
        <circle class="ec-probe-core" cx="294" cy="282" r="4" />
        <rect class="ec-probe-tag" x="352" y="254" width="65" height="27" rx="4" />
        <text class="ec-probe-text" x="384.5" y="272" text-anchor="middle">eBPF</text>
        <path class="ec-arrow" d="m430 263 5 4-5 4" />
      </g>
    </svg>
    <div class="capture-terminal" :aria-label="zh ? 'TLS 明文输出示例' : 'TLS plaintext output example'">
      <div class="capture-terminal-title"><span>PLAINTEXT PREVIEW</span><span class="demo-label">DEMO</span></div>
      <pre><code><span class="terminal-prompt">$ </span><span class="terminal-command">sudo ecapture tls</span>

<span class="terminal-success">GET / HTTP/1.1</span>
Host: example.com

<span class="terminal-success">HTTP/1.1 200 OK</span></code></pre>
    </div>
    <button class="flow-control" type="button" :aria-pressed="paused" @click="paused = !paused">
      <span aria-hidden="true">{{ paused ? '▷' : 'Ⅱ' }}</span>
      {{ zh ? (paused ? '播放动效' : '暂停动效') : (paused ? 'Play animation' : 'Pause animation') }}
    </button>
  </figure>
</template>
<style scoped>
.capture-flow { position:relative; width:100%; min-width:0; margin:0 0 40px; }
.ec-diagram { display:block; width:68%; height:auto; overflow:visible; }
.ec-diagram path { stroke-linejoin:round; }
.ec-plane-face { fill:var(--ec-plate); stroke:var(--ec-wire); stroke-width:1; }
.ec-plane-edge { fill:none; stroke:var(--ec-wire); opacity:.75; stroke-width:.8; }
.ec-grid { fill:none; stroke:var(--ec-grid); stroke-width:.65; }
.ec-cube-top { fill:var(--ec-cube); stroke:var(--ec-wire); stroke-width:1; }
.ec-cube-side { fill:var(--ec-cube-side); stroke:var(--ec-wire); stroke-width:1; }
.ec-diagram text { font:12px var(--vt-font-family-mono); fill:var(--ec-text); letter-spacing:.04em; }
.ec-diagram .ec-layer-label { font-size:13px; }
.ec-tracks { fill:none; stroke:var(--ec-muted); opacity:.6; stroke-width:.9; stroke-dasharray:1.5 5; }
.ec-tail { stroke:url(#ec-flow-tail); stroke-width:2.3; stroke-linecap:round; fill:none; }
.ec-dot { fill:var(--ec-yellow); stroke:#b99520; stroke-width:.65; }
:global(.dark) .ec-dot { stroke:#ffe483; }
.ec-dot-halo { fill:var(--ec-yellow); opacity:.1; }
.ec-branch, .ec-arrow { fill:none; stroke:var(--ec-accent); stroke-width:1.4; }
.ec-probe-halo { fill:var(--ec-yellow); opacity:.12; }
.ec-probe-core, .ec-probe-tag { fill:var(--ec-yellow); }
.ec-diagram .ec-probe-text { fill:#202326; font-weight:700; letter-spacing:0; }
.ec-packet { animation:ec-flow-down linear infinite; will-change:transform; }
.is-stopped .ec-packet { animation-play-state:paused; }
@keyframes ec-flow-down { 0% { transform:translateY(0); opacity:0; } 6%,94% { opacity:1; } 100% { transform:translateY(308px); opacity:0; } }
.capture-terminal { position:absolute; top:46%; right:0; width:40%; border:1px solid var(--ec-wire); border-radius:5px; background:var(--ec-bg); box-shadow:var(--ec-shadow); }
.capture-terminal-title { display:flex; justify-content:space-between; align-items:center; gap:6px; padding:10px 12px; border-bottom:1px solid var(--ec-border); font:9px var(--vt-font-family-mono); letter-spacing:.07em; color:var(--ec-muted); }
.demo-label { padding:3px 6px; border-radius:3px; background:var(--ec-yellow); color:#202326; font-weight:700; }
.capture-terminal pre { margin:0; padding:15px 14px 19px; overflow:auto; font:12px/1.6 var(--vt-font-family-mono); color:var(--ec-ink); }
.terminal-prompt { color:var(--ec-muted); }
.terminal-command { color:var(--ec-accent); }
.terminal-success { color:var(--ec-success); }
.flow-control { display:flex; gap:6px; align-items:center; position:absolute; right:0; top:100%; margin-top:8px; color:var(--ec-muted); background:transparent; font:11px var(--vt-font-family-mono); min-height:32px; cursor:pointer; }
.flow-control:hover { color:var(--ec-accent); }
@media(max-width:560px) {
  .capture-flow { display:grid; grid-template-columns:60% 40%; align-items:center; margin-bottom:0; }
  .ec-diagram { grid-area:1 / 1; width:113.333%; }
  .capture-terminal { grid-area:1 / 2; position:relative; top:auto; right:auto; width:100%; margin-top:60px; }
  .capture-terminal-title { padding:8px; font-size:8px; }
  .capture-terminal pre { padding:12px 8px; font-size:10px; }
  .ec-diagram .ec-layer-label { font-size:17px; }
  .flow-control { grid-column:1 / -1; position:static; justify-self:end; margin-top:8px; font-size:10px; }
}
</style>
