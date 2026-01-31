<template>
  <div class="tech-background">
    <div class="grid-layer"></div>
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
    <div class="scan-line"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
}

const colors = ['#43AA8B', '#90BE6D', '#F8961E', '#F9C74F', '#F3722C']

const initParticles = (canvas: HTMLCanvasElement) => {
  particles = []
  const particleCount = Math.floor((canvas.width * canvas.height) / 15000)

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.2
    })
  }
}

const drawParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw particles
  particles.forEach(particle => {
    particle.x += particle.vx
    particle.y += particle.vy

    // Wrap around edges
    if (particle.x < 0) particle.x = canvas.width
    if (particle.x > canvas.width) particle.x = 0
    if (particle.y < 0) particle.y = canvas.height
    if (particle.y > canvas.height) particle.y = 0

    // Draw particle
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = particle.color
    ctx.globalAlpha = particle.opacity
    ctx.fill()
    ctx.globalAlpha = 1
  })

  // Draw connections
  ctx.strokeStyle = '#43AA8B'
  ctx.lineWidth = 0.5

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 120) {
        ctx.globalAlpha = (1 - distance / 120) * 0.3
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }
  }
}

const animate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  drawParticles(ctx, canvas)
  animationId = requestAnimationFrame(() => animate(ctx, canvas))
}

const handleResize = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initParticles(canvas)
}

onMounted(() => {
  if (canvasRef.value) {
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')

    if (ctx) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      initParticles(canvas)
      animate(ctx, canvas)

      const resizeHandler = () => handleResize(canvas, ctx)
      window.addEventListener('resize', resizeHandler)

      onUnmounted(() => {
        if (animationId) cancelAnimationFrame(animationId)
        window.removeEventListener('resize', resizeHandler)
      })
    }
  }
})
</script>

<style scoped>
.tech-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.grid-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(67, 170, 139, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(67, 170, 139, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-scroll 20s linear infinite;
}

.dark .grid-layer {
  background-image:
    linear-gradient(rgba(92, 208, 174, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(92, 208, 174, 0.06) 1px, transparent 1px);
}

@keyframes grid-scroll {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.dark .particle-canvas {
  opacity: 0.6;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(67, 170, 139, 0.8), transparent);
  animation: scan 8s linear infinite;
  opacity: 0.3;
}

.dark .scan-line {
  background: linear-gradient(90deg, transparent, rgba(92, 208, 174, 0.9), transparent);
  opacity: 0.5;
}

@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
  }
}
</style>

