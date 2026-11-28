<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId } from 'vue'
import CaptureDiagramNode from './CaptureDiagramNode.vue'
import CapturePipeline from './CapturePipeline.vue'
import { captureLayers, type CaptureItem, type CaptureLayer } from './captureDiagramData'
import { captureExamples, exampleForItem, flowNotes, type CaptureExampleId } from './captureFlowData'

const props = defineProps<{ zh: boolean }>()
const root = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const panelTitle = ref<HTMLElement>()
const selected = ref<{ layer: CaptureLayer; item: CaptureItem }>()
const exampleId = ref<CaptureExampleId>('openssl')
const example = computed(() => captureExamples[exampleId.value])
const panelOpen = ref(false)
const paused = ref(false)
const reducedMotion = ref(false)
const visible = ref(false)
const pageVisible = ref(true)
const stopped = computed(() => paused.value || reducedMotion.value || !visible.value || !pageVisible.value)
const prefix = useId().replace(/:/g, '')
const svgId = (name: string) => `capture-${prefix}-${name}`
const paint = (name: string) => `url(#${svgId(name)})`
const titleId = svgId('detail-title')
const panelId = svgId('detail')
const t = (copy: { en: string; zh: string }) => props.zh ? copy.zh : copy.en
const isLayer = computed(() => selected.value?.item.id === selected.value?.layer.id)
const docLink = computed(() => `/${props.zh ? 'zh' : 'en'}${selected.value?.item.doc ?? ''}`)
const nodePositions = [[108, 116], [234, 142], [356, 166]]
const activeLayer = (id: string) => selected.value?.layer.id === id
const chosenItem = (id: string) => selected.value?.item.id === id
const activeItem = (id: string) => panelOpen.value && selected.value?.item.id === id
const previewContext = computed(() => selected.value ? t(selected.value.item.title) : (props.zh ? '三层协作 · 完整流程' : 'Three layers · one flow'))
const previewNote = computed(() => t(flowNotes[selected.value?.item.id ?? 'overview']))
const actionLabel = (item: CaptureItem) => props.zh ? `查看${t(item.title)}详情` : `Explore ${t(item.title)}`
let opener: HTMLElement | SVGElement | undefined
let observer: IntersectionObserver | undefined
let media: MediaQueryList | undefined

function positionPanel() {
  if (!root.value || !panel.value) return
  const rect = root.value.getBoundingClientRect()
  const width = Math.min(360, window.innerWidth - 32)
  // Keep the selected diagram and its linked output visible beside the details.
  const left = rect.left > width + 32 ? rect.left - width - 20 : Math.max(16, rect.left)
  const top = Math.max(88, Math.min(rect.top + 62, window.innerHeight - panel.value.offsetHeight - 20))
  panel.value.style.setProperty('--detail-left', `${left}px`)
  panel.value.style.setProperty('--detail-top', `${top}px`)
}

async function explore(layer: CaptureLayer, item: CaptureItem, event?: Event) {
  // Keep the original diagram trigger while navigating within its detail card.
  if (event?.currentTarget instanceof Element && !panel.value?.contains(event.currentTarget)) {
    opener = event.currentTarget as HTMLElement | SVGElement
  }
  selected.value = { layer, item }
  exampleId.value = exampleForItem(item.id, exampleId.value)
  panelOpen.value = true
  await nextTick()
  if (!panel.value?.isConnected) return
  if (!panel.value.matches(':popover-open')) panel.value.showPopover()
  positionPanel()
  panelTitle.value?.focus({ preventScroll: true })
}
function closePanel() {
  panel.value?.hidePopover()
  panelOpen.value = false
  opener?.focus({ preventScroll: true })
}
function resetView() {
  panel.value?.hidePopover()
  panelOpen.value = false
  selected.value = undefined
  exampleId.value = 'openssl'
}
function onToggle(event: Event) {
  const open = (event as Event & { newState: string }).newState === 'open'
  panelOpen.value = open
  // Light-dismiss must not steal focus from another control just clicked.
  if (!open && panel.value?.contains(document.activeElement)) opener?.focus({ preventScroll: true })
}
function onKeydown(event: KeyboardEvent, layer: CaptureLayer, item: CaptureItem) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  if (!event.repeat) explore(layer, item, event)
}
const updateMotion = () => { reducedMotion.value = media?.matches ?? false }
const updateVisibility = () => { pageVisible.value = !document.hidden }
const onResize = () => { if (panelOpen.value) positionPanel() }
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotion()
  media.addEventListener('change', updateMotion)
  document.addEventListener('visibilitychange', updateVisibility)
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onResize, { passive: true })
  updateVisibility()
  observer = new IntersectionObserver(([entry]) => { visible.value = entry.isIntersecting })
  if (root.value) observer.observe(root.value)
})
onUnmounted(() => {
  observer?.disconnect()
  media?.removeEventListener('change', updateMotion)
  document.removeEventListener('visibilitychange', updateVisibility)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onResize)
})
</script>

<template>
  <figure ref="root" class="capture-flow" :class="{ 'is-stopped': stopped }">
    <div class="capture-scene">
      <svg class="ec-diagram" viewBox="0 0 760 630" role="group" :aria-describedby="svgId('flow-summary')"
        :aria-label="zh ? '可交互的应用、TLS 库与内核三层架构' : 'Explore the application, TLS library and kernel layers'"
        :style="{ '--capture-node-top': paint('node-top'), '--capture-node-front': paint('node-front'), '--capture-node-side': paint('node-side'), '--capture-selected-top': paint('selected-top') }">
        <defs>
          <linearGradient :id="svgId('glass')" x1="0" y1="0" x2=".7" y2="1"><stop class="glass-light" offset="0" /><stop class="glass-shade" offset="1" /></linearGradient>
          <linearGradient :id="svgId('glass-edge')" x1="0" y1="0" x2="0" y2="1"><stop class="glass-edge-light" offset="0" /><stop class="glass-edge-shade" offset="1" /></linearGradient>
          <linearGradient :id="svgId('node-top')" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="node-stop-light" /><stop offset="1" class="node-stop-mid" /></linearGradient>
          <linearGradient :id="svgId('node-front')" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="node-stop-mid" /><stop offset="1" class="node-stop-shade" /></linearGradient>
          <linearGradient :id="svgId('node-side')" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="node-stop-shade" /><stop offset="1" class="node-stop-mid" /></linearGradient>
          <linearGradient :id="svgId('selected-top')" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe893" /><stop offset="1" stop-color="#ffcc1a" /></linearGradient>
          <marker :id="svgId('flow-arrow')" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="flow-arrow-head" d="m1 1 6 3-6 3" /></marker>
          <marker :id="svgId('traffic-arrow')" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path class="traffic-arrow-head" d="m1 1 6 3-6 3" /></marker>
        </defs>
        <ellipse class="stack-shadow" cx="263" cy="562" rx="218" ry="23" aria-hidden="true" />
        <g class="signal-tracks" aria-hidden="true">
          <path d="M211 127V467M337 165V505" />
          <circle v-for="(y, index) in [155, 222, 325, 392]" :key="y" class="signal-packet" cx="211" :cy="y" r="3.2" :style="{ animationDelay: `${index * -.8}s` }" />
          <circle v-for="(y, index) in [195, 262, 365, 432]" :key="y" class="signal-packet" cx="337" :cy="y" r="3.2" :style="{ animationDelay: `${index * -.8 - .4}s` }" />
        </g>
        <g v-for="(layer, layerIndex) in captureLayers" :key="layer.id" :transform="`translate(0 ${layerIndex * 170})`" class="capture-layer" :class="{ 'is-active-layer': activeLayer(layer.id) }">
          <g class="layer-trigger" role="button" tabindex="0" aria-haspopup="dialog" :aria-label="actionLabel(layer)" :aria-expanded="activeItem(layer.id)" :aria-controls="panelId"
            @click="explore(layer, layer, $event)" @keydown="onKeydown($event, layer, layer)">
            <path class="plate-edge" :fill="paint('glass-edge')" d="M32 121 302 215 490 143v14q0 5-6 7l-176 67q-6 2-12 0L38 141q-6-2-6-7Z" />
            <path class="plate-top" :fill="paint('glass')" d="M38 117 215 51q6-2 12 0l257 88q12 4 0 9l-176 67q-6 2-12 0L38 126q-12-4 0-9Z" />
            <path class="plate-grid" d="m82 138 188-72m-135 90 188-72m-135 90 188-72m-135 90 188-72M77 104l270 93M124 86l270 93M171 69l270 93" />
            <path class="plate-highlight" d="M34 122 302 216 488 145" />
            <g class="layer-label" transform="matrix(1 .345 0 1 51 151)">
              <rect class="layer-label-hit" x="-15" y="-22" width="180" height="38" rx="4" />
              <circle class="layer-plus" cx="0" cy="-5" r="10" /><path class="layer-plus-symbol" d="M-4-5h8M0-9v8" />
              <text x="19" y="0">{{ zh ? t(layer.title) : layer.label }}</text>
            </g>
          </g>
          <g v-for="(item, index) in layer.components" :key="item.id" :transform="`translate(${nodePositions[index][0]} ${nodePositions[index][1]})`">
            <g class="node-trigger" :class="{ 'is-selected': chosenItem(item.id), 'is-featured': !selected && item.id === 'openssl' }"
              role="button" tabindex="0" aria-haspopup="dialog" :aria-label="actionLabel(item)" :aria-expanded="activeItem(item.id)" :aria-controls="panelId"
              @click.stop="explore(layer, item, $event)" @keydown="onKeydown($event, layer, item)">
              <path class="node-hit" :d="item.shape === 'server' ? 'M-9-75H117V34H-9Z' : layerIndex === 0 ? 'M-9-63H117V61H-9Z' : 'M-9-35H117V42H-9Z'" />
              <CaptureDiagramNode :label="item.label" :shape="item.shape ?? 'library'" :bee="item.id === 'ebpf'" />
            </g>
          </g>
        </g>
        <g class="capture-routes" aria-hidden="true">
          <g class="traffic-route" :class="{ 'route-focused': activeLayer('application') || chosenItem('tcpip') }">
            <path class="flow-route" d="M490 143H504V507H465" :marker-end="paint('traffic-arrow')" />
            <text transform="translate(495 243) rotate(90)">{{ zh ? '加密流量' : 'ENCRYPTED TRAFFIC' }}</text>
          </g>
          <g class="secret-route" :class="{ 'route-focused': activeLayer('tls') || chosenItem('ebpf') }">
            <path class="flow-route" d="M302 386V413L190 454" :marker-end="paint('flow-arrow')" />
            <circle cx="302" cy="386" r="3" />
            <text x="182" y="410">{{ zh ? 'TLS 密钥' : 'TLS SECRETS' }}</text>
          </g>
          <g class="event-route" :class="{ 'route-focused': activeLayer('kernel') }">
            <path class="flow-route" d="M216 468 245 478M356 506H349L332 490" :marker-end="paint('flow-arrow')" />
            <path class="flow-route event-route-desktop" d="M298 511 302 583H528V165H546" :marker-end="paint('flow-arrow')" />
            <path class="flow-route event-route-mobile" d="M298 511 302 600H262V630" :marker-end="paint('flow-arrow')" />
            <text class="event-route-label" x="345" y="605">{{ zh ? 'eBPF 采集事件' : 'eBPF EVENTS' }}</text>
          </g>
        </g>
      </svg>
      <CapturePipeline class="flow-output" :zh="zh" :example="example" :context="previewContext" :note="previewNote" />
    </div>
    <p :id="svgId('flow-summary')" class="flow-summary">{{ zh ? '应用通信 → TLS 密钥与网络报文 → 内核采集事件 → 用户态解密 → 明文消息' : 'Application traffic → TLS secrets + packets → kernel events → user-space decryption → plaintext' }}</p>
    <figcaption class="capture-caption">
      <span class="capture-hint"><svg viewBox="0 0 20 24" aria-hidden="true"><rect x="4" y="1" width="12" height="21" rx="6" /><path d="M10 1v7" /></svg>{{ zh ? '点击层板或组件，探索捕获原理' : 'Select a layer or component to explore' }}</span>
      <button class="reset-view" type="button" :disabled="!selected" @click="resetView">{{ zh ? '重置视图' : 'Reset view' }}</button>
      <button class="flow-control" type="button" :aria-pressed="paused || reducedMotion" :disabled="reducedMotion" @click="paused = !paused"><span aria-hidden="true">{{ paused || reducedMotion ? '▷' : 'Ⅱ' }}</span>{{ reducedMotion ? (zh ? '已减少动态效果' : 'Reduced motion') : zh ? (paused ? '播放动效' : '暂停动效') : (paused ? 'Play animation' : 'Pause animation') }}</button>
    </figcaption>
    <div ref="panel" :id="panelId" class="capture-detail" popover="auto" role="dialog" :aria-labelledby="titleId" @toggle="onToggle" @keydown.esc.stop.prevent="closePanel">
      <template v-if="selected">
        <div class="detail-header"><span>{{ t(selected.layer.title) }} <span aria-hidden="true">/</span> {{ isLayer ? (zh ? '层级概览' : 'LAYER') : (zh ? '组件详情' : 'COMPONENT') }}</span>
          <button class="detail-close" type="button" :aria-label="zh ? '关闭详情' : 'Close details'" @click="closePanel"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M5 15 15 5" /></svg></button>
        </div>
        <div class="detail-body">
          <h3 ref="panelTitle" :id="titleId" tabindex="-1">{{ t(selected.item.title) }}</h3>
          <p class="detail-description">{{ t(selected.item.description) }}</p>
          <div class="detail-preview"><span>{{ zh ? '对应明文示例' : 'LINKED PLAINTEXT EXAMPLE' }} · {{ example.probe }}</span><pre>{{ example.request }}
Host: {{ example.host }}
{{ example.response }}</pre></div>
          <dl class="detail-facts"><div v-for="fact in selected.item.details" :key="fact.label.en"><dt>{{ t(fact.label) }}</dt><dd>{{ t(fact.value) }}</dd></div></dl>
          <code v-if="selected.item.command" class="detail-command">$ {{ selected.item.command }}</code>
          <div class="detail-related">
            <button v-if="!isLayer" type="button" class="layer-overview" @click="explore(selected.layer, selected.layer)">{{ zh ? '查看所在层' : 'Layer overview' }}</button><span v-else>{{ zh ? '本层组件' : 'IN THIS LAYER' }}</span>
            <div class="component-links"><button v-for="item in selected.layer.components" :key="item.id" type="button" :aria-pressed="selected.item.id === item.id" @click="explore(selected.layer, item)">{{ item.label }}</button></div>
          </div>
          <a class="detail-doc" :href="docLink">{{ zh ? '阅读相关文档' : 'Read the documentation' }}</a>
        </div>
      </template>
    </div>
  </figure>
</template>

<style scoped>
.capture-flow { position:relative; width:100%; min-width:0; margin:0; }
.capture-scene { position:relative; isolation:isolate; display:grid; grid-template-columns:72% 28%; align-items:start; }
.ec-diagram { display:block; grid-column:1 / -1; grid-row:1; width:100%; height:auto; overflow:visible; }
.ec-diagram path { stroke-linejoin:round; }
.glass-light { stop-color:var(--ec-surface-raised); stop-opacity:.72; }
.glass-shade { stop-color:var(--ec-wire); stop-opacity:.17; }
.glass-edge-light { stop-color:var(--ec-surface-raised); stop-opacity:.9; }
.glass-edge-shade { stop-color:var(--ec-wire); stop-opacity:.48; }
.node-stop-light { stop-color:var(--ec-surface-raised); }
.node-stop-mid { stop-color:var(--ec-surface); }
.node-stop-shade { stop-color:var(--ec-border); }
.stack-shadow { fill:var(--ec-wire); opacity:.16; filter:blur(13px); }
.plate-top { stroke:var(--ec-wire); stroke-width:1; }
.plate-edge { stroke:var(--ec-wire); stroke-width:.6; }
.plate-grid { fill:none; stroke:var(--ec-grid); stroke-width:.8; opacity:.6; pointer-events:none; }
.plate-highlight { fill:none; stroke:var(--ec-surface-raised); stroke-width:2; pointer-events:none; }
.layer-trigger, .node-trigger { cursor:pointer; outline:none; }
.layer-label-hit { fill:transparent; }
.layer-label text { fill:var(--ec-text); font:600 14px var(--vt-font-family-mono); letter-spacing:1.1px; }
.layer-plus { fill:var(--ec-surface-raised); stroke:var(--ec-accent); stroke-width:1; }
.layer-plus-symbol { fill:none; stroke:var(--ec-accent); stroke-width:1.5; }
.layer-trigger:hover .plate-top, .layer-trigger:focus-visible .plate-top, .is-active-layer .plate-top { stroke:var(--ec-accent); stroke-width:1.6; }
.layer-trigger:focus-visible .plate-edge { stroke:var(--ec-accent); stroke-width:3; }
.node-trigger { transition:transform .2s ease; }
.node-trigger:hover, .node-trigger:focus-visible, .node-trigger.is-selected { transform:translateY(-7px); }
.node-hit { fill:transparent; stroke:transparent; stroke-width:2; }
.node-trigger:focus-visible .node-hit { stroke:var(--ec-accent); stroke-dasharray:4 3; }
.node-trigger:is(:hover, :focus-visible, .is-selected, .is-featured) :deep(.node-top) { fill:var(--capture-selected-top); stroke:#ffe893; }
.node-trigger:is(:hover, :focus-visible, .is-selected, .is-featured) :deep(.node-front) { fill:var(--ec-yellow); stroke:var(--ec-accent); }
.node-trigger:is(:hover, :focus-visible, .is-selected, .is-featured) :deep(.node-side) { fill:#d6a414; stroke:var(--ec-accent); }
.node-trigger:is(:hover, :focus-visible, .is-selected, .is-featured) :deep(.node-label) { fill:#202326; }
.node-trigger:is(:hover, :focus-visible, .is-selected) :deep(.window-label) { fill:var(--ec-ink); }
.node-trigger:is(:hover, :focus-visible, .is-selected) :deep(.window-symbol) { stroke:#454d54; }
.node-trigger:is(:hover, :focus-visible, .is-selected) :deep(.node-shadow) { fill:var(--ec-yellow); opacity:.24; }
.signal-tracks { pointer-events:none; }
.signal-tracks path { fill:none; stroke:var(--ec-accent); stroke-opacity:.4; stroke-width:1; stroke-dasharray:2 5; }
.signal-packet { fill:var(--ec-yellow); stroke:var(--ec-accent); stroke-width:.5; animation:capture-packet 3.2s linear infinite; }
@keyframes capture-packet { 0% { transform:translateY(-25px); opacity:0; } 18%,78% { opacity:1; } 100% { transform:translateY(35px); opacity:0; } }
.is-stopped .signal-packet { animation-play-state:paused; }
/* Both inputs leave through the kernel event channel; no library outputs plaintext. */
.capture-routes { pointer-events:none; }
.flow-route { fill:none; stroke:var(--ec-accent); stroke-width:1.5; }
.flow-arrow-head { fill:none; stroke:var(--ec-accent); stroke-width:1.2; }
.traffic-arrow-head { fill:none; stroke:var(--ec-muted); stroke-width:1.2; }
.traffic-route .flow-route { stroke:var(--ec-muted); stroke-dasharray:3 5; animation:flow-route-travel 1.8s linear infinite; }
.secret-route circle { fill:var(--ec-yellow); stroke:var(--ec-accent); }
.capture-routes text { fill:var(--ec-muted); font:10px var(--vt-font-family-mono); letter-spacing:.4px; }
.secret-route text, .event-route-label { fill:var(--ec-accent); }
.route-focused .flow-route { stroke-width:2.5; }
.event-route-desktop { stroke-dasharray:5 3; animation:flow-route-travel 1.8s linear infinite; }
.event-route-mobile { display:none; }
@keyframes flow-route-travel { to { stroke-dashoffset:-32; } }
.is-stopped .flow-route { animation-play-state:paused; }
.flow-output { grid-column:2; grid-row:1; margin-top:65%; }
.flow-summary { color:var(--ec-muted); margin:10px 0 8px; font-size:11px; line-height:1.7; }
.reset-view { min-height:36px; padding:4px 0; border:0; background:transparent; color:var(--ec-accent); font:11px var(--vt-font-family-mono); cursor:pointer; }
.reset-view:disabled { color:var(--ec-muted); opacity:.6; cursor:default; }
.detail-preview { display:none; }
.capture-caption { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:4px 12px; margin-top:0; color:var(--ec-muted); }
.capture-hint { display:flex; align-items:center; gap:8px; font-size:12px; line-height:1.5; }
.capture-hint svg { width:16px; height:20px; fill:none; stroke:currentColor; stroke-width:1.3; flex:none; }
.flow-control { display:flex; gap:6px; align-items:center; min-height:36px; padding:4px 0; background:transparent; color:var(--ec-muted); font:11px var(--vt-font-family-mono); cursor:pointer; }
.flow-control:hover { color:var(--ec-accent); }
.flow-control:disabled { cursor:default; }
.capture-detail { position:fixed; inset:auto; top:var(--detail-top, 120px); left:var(--detail-left, 16px); width:min(360px, calc(100vw - 32px)); max-height:calc(100dvh - 108px); margin:0; padding:0; overflow:auto; overscroll-behavior:contain; border:1px solid var(--ec-wire); border-radius:12px; background:var(--ec-surface-raised); color:var(--ec-ink); box-shadow:0 18px 60px #0002, 0 3px 12px #0001; }
.capture-detail:popover-open { animation:capture-detail-in .18s ease-out; }
.capture-detail::backdrop { background:transparent; }
@keyframes capture-detail-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.detail-header { display:flex; justify-content:space-between; align-items:center; gap:12px; min-height:52px; padding:6px 10px 6px 20px; border-bottom:1px solid var(--ec-border); color:var(--ec-muted); font:11px/1.5 var(--vt-font-family-mono); letter-spacing:.04em; text-transform:uppercase; }
.detail-header > span > span { margin:0 5px; }
.detail-close { display:grid; place-items:center; flex:none; width:36px; height:36px; border-radius:6px; color:var(--ec-text); background:transparent; cursor:pointer; }
.detail-close:hover { background:var(--ec-surface); }
.detail-close svg { width:20px; height:20px; stroke:currentColor; stroke-width:1.5; }
.detail-body { padding:20px; }
.detail-body h3 { margin:0 0 12px; font-size:24px; line-height:1.2; font-weight:700; letter-spacing:-.025em; outline:none; }
.detail-description { margin:0 0 18px; color:var(--ec-text); font-size:14px; line-height:1.75; }
.detail-facts { margin:0 0 18px; font-size:12px; line-height:1.6; }
.detail-facts > div { display:grid; grid-template-columns:90px 1fr; gap:12px; padding:9px 0; border-top:1px solid var(--ec-border); }
.detail-facts dt { color:var(--ec-muted); }
.detail-facts dd { margin:0; color:var(--ec-text); }
.detail-command { display:block; padding:12px; margin:0 0 18px; border-radius:5px; background:var(--ec-code); color:var(--ec-accent); font:12px/1.7 var(--vt-font-family-mono); overflow-wrap:anywhere; }
.detail-related > span, .layer-overview { font:11px/1.5 var(--vt-font-family-mono); color:var(--ec-muted); }
.layer-overview { background:none; cursor:pointer; padding:0; min-height:30px; text-decoration:underline; text-underline-offset:4px; }
.layer-overview:hover { color:var(--ec-accent); }
.component-links { display:flex; flex-wrap:wrap; gap:7px; margin:8px 0 18px; }
.component-links button { padding:7px 11px; min-height:36px; border:1px solid var(--ec-border); border-radius:6px; color:var(--ec-text); background:var(--ec-bg); font-size:12px; cursor:pointer; }
.component-links button:hover, .component-links button[aria-pressed=true] { border-color:var(--ec-accent); background:var(--ec-accent-soft); color:var(--ec-accent); }
.detail-doc { color:var(--ec-accent); font-size:13px; font-weight:600; text-decoration:underline; text-underline-offset:4px; }
@media (max-width:1050px) and (min-width:761px) {
  .capture-caption { gap:0 10px; }
  .capture-hint { font-size:11px; }
}
@media (max-width:620px) {
  .capture-scene { display:block; overflow:hidden; }
  .ec-diagram { width:145%; max-width:none; }
  .event-route-desktop, .event-route-label { display:none; }
  .event-route-mobile { display:block; stroke-dasharray:5 3; animation:flow-route-travel 1.8s linear infinite; }
  .flow-output { position:relative; top:auto; right:auto; width:100%; margin-top:0; padding-top:12px; }
  .flow-output::before { content:''; position:absolute; top:0; height:12px; left:50%; border-left:1px solid var(--ec-accent); }
  .capture-caption { margin-top:12px; }
  .capture-hint { flex-basis:100%; font-size:12px; }
  .flow-summary { margin-top:18px; font-size:12px; }
  .capture-detail { top:auto; left:16px; bottom:16px; width:calc(100vw - 32px); max-height:75dvh; border-radius:14px; }
  .detail-header { position:sticky; top:0; background:var(--ec-surface-raised); }
  .detail-close { width:44px; height:44px; }
  .component-links button { min-height:44px; }
  .detail-preview { display:block; margin:0 0 18px; padding:12px; border:1px solid var(--ec-border); border-radius:5px; background:var(--ec-code); }
  .detail-preview > span { color:var(--ec-muted); font-size:11px; }
  .detail-preview pre { margin:8px 0 0; white-space:pre-wrap; overflow-wrap:anywhere; font:11px/1.7 var(--vt-font-family-mono); color:var(--ec-success); }
}
@media (prefers-reduced-motion:reduce) {
  .signal-packet, .flow-route, .capture-detail:popover-open { animation:none; }
  .node-trigger { transition:none; }
}
</style>
