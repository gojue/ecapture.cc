<script setup lang="ts">
defineProps<{ label: string; shape: 'server' | 'terminal' | 'code' | 'library' | 'chip'; bee?: boolean }>()
</script>
<template>
  <g class="capture-node-art" aria-hidden="true">
    <ellipse class="node-shadow" cx="56" cy="13" rx="63" ry="23" />
    <template v-if="shape === 'server'">
      <g v-for="level in 3" :key="level" :transform="`translate(0 ${-20 * (level - 1)})`">
        <path class="node-front" d="M0-10 64 12V29L0 7Z" />
        <path class="node-side" d="m64 12 44-17v17L64 29Z" />
        <path class="node-top" d="M0-10 44-27 108-5 64 12Z" />
        <path class="node-vents" d="M9 0v6m5-4v6m5-4v6m5-4v6m5-4v6m5-4v6m5-4v6" />
        <circle class="node-light" cx="86" cy="12" r="2.6" /><circle class="node-light" cx="97" cy="8" r="2.6" />
      </g>
      <text class="node-label" transform="translate(54 -42) rotate(19)" text-anchor="middle">{{ label }}</text>
    </template>
    <template v-else-if="shape === 'terminal' || shape === 'code'">
      <path class="node-side" d="m7-52 9-5 85 29v64l-9 5-4-8Z" />
      <path class="node-front window-front" d="M7-52 92-23V41L7 12Z" />
      <path class="window-bar" d="M7-52 92-23v13L7-39Z" />
      <g transform="matrix(1 .342 0 1 7 -52)">
        <circle class="node-light" cx="9" cy="7" r="2" /><circle class="window-dot" cx="17" cy="7" r="2" /><circle class="window-dot" cx="25" cy="7" r="2" />
        <path v-if="shape === 'terminal'" class="window-symbol" d="m27 28 10 8-10 8m17 0h12" />
        <path v-else class="window-symbol" d="m29 28-9 8 9 8m27-16 9 8-9 8m-9-21-9 26" />
      </g>
      <text class="node-label window-label" transform="translate(52 53) rotate(19)" text-anchor="middle">{{ label }}</text>
    </template>
    <template v-else>
      <g v-if="shape === 'chip'" class="node-pins">
        <path v-for="pin in 5" :key="pin" :d="`M${8 + pin * 10} ${16 + pin * 3.45}v8l-6-2v-8Z`" />
        <path v-for="pin in 3" :key="`right-${pin}`" :d="`M${70 + pin * 10} ${29 - pin * 3.8}v8l6-2v-8Z`" />
      </g>
      <path class="node-front" d="M0-10 64 12v17L0 7Z" /><path class="node-side" d="m64 12 44-17v17L64 29Z" />
      <path class="node-top" d="M0-10 44-27 108-5 64 12Z" /><path class="node-rim" d="m5-10 39-14L102-5 64 9Z" />
      <template v-if="bee">
        <g class="bee-decal" transform="matrix(1 .344 -.8 .309 41 -24)">
          <image href="/assets/brand/ebpf-bee.png" x="4.5" y="0" width="48" height="48" transform="rotate(-30 28.5 24)" />
        </g>
        <text class="node-label bee-label" transform="translate(31 15) rotate(19)" text-anchor="middle">{{ label }}</text>
      </template>
      <text v-else class="node-label" transform="translate(54 -3) rotate(19)" text-anchor="middle">{{ label }}</text>
    </template>
  </g>
</template>
<style scoped>
.capture-node-art { stroke-linejoin:round; }
.node-shadow { fill:var(--ec-wire); opacity:.15; filter:blur(5px); }
.node-top { fill:var(--capture-node-top); stroke:var(--ec-surface-raised); stroke-width:1.3; }
.node-front { fill:var(--capture-node-front); stroke:var(--ec-border); stroke-width:.9; }
.node-side { fill:var(--capture-node-side); stroke:var(--ec-wire); stroke-width:.6; }
.node-rim { fill:none; stroke:var(--ec-surface-raised); stroke-width:.8; opacity:.6; }
.node-label { fill:var(--ec-ink); font:600 16px var(--vt-font-family-base); letter-spacing:-.4px; }
.bee-label { font-size:12px; }
.node-light { fill:var(--ec-yellow); stroke:var(--ec-accent); stroke-width:.5; }
.node-vents { fill:none; stroke:var(--ec-wire); stroke-width:1; }
.node-pins { fill:var(--ec-wire); stroke:var(--ec-surface); stroke-width:1; }
.window-bar { fill:var(--ec-wire); opacity:.38; }
.window-dot { fill:var(--ec-surface-raised); }
.window-symbol { fill:none; stroke:var(--ec-muted); stroke-width:2; stroke-linecap:round; }
</style>
