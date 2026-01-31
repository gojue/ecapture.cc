<template>
  <div class="network-capture-effect">
    <!-- Matrix Rain Effect -->
    <canvas ref="matrixCanvas" class="matrix-rain"></canvas>

    <!-- Hexagon Grid -->
    <canvas ref="hexCanvas" class="hex-grid"></canvas>

    <!-- Data Packets -->
    <canvas ref="packetCanvas" class="data-packets"></canvas>

    <!-- Mouse Follow Encryption Effect -->
    <div ref="mouseEffect" class="mouse-encryption-effect">
      <div
        v-for="n in 20"
        :key="n"
        class="encryption-particle"
        :style="{ animationDelay: `${n * 0.1}s` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const matrixCanvas = ref<HTMLCanvasElement | null>(null)
const hexCanvas = ref<HTMLCanvasElement | null>(null)
const packetCanvas = ref<HTMLCanvasElement | null>(null)
const mouseEffect = ref<HTMLDivElement | null>(null)

let matrixAnimationId: number | null = null
let hexAnimationId: number | null = null
let packetAnimationId: number | null = null

// Mouse position tracking
let mouseX = 0
let mouseY = 0

// Matrix Rain Effect
interface MatrixColumn {
  x: number
  y: number
  speed: number
  chars: string[]
}

const initMatrixRain = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホABCDEF0123456789@#$%^&*(){}[]<>'.split('')
  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops: MatrixColumn[] = []

  // Initialize columns
  for (let i = 0; i < columns; i++) {
    drops.push({
      x: i * fontSize,
      y: Math.random() * -500,
      speed: Math.random() * 2 + 1,
      chars: Array(20).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)])
    })
  }

  const drawMatrix = () => {
    // Semi-transparent black for trail effect
    ctx.fillStyle = 'rgba(10, 14, 20, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drops.forEach(drop => {
      drop.chars.forEach((char, i) => {
        const y = drop.y + i * fontSize

        // Color gradient based on position
        if (i === drop.chars.length - 1) {
          ctx.fillStyle = '#5cd0ae' // Bright teal for leading char
          ctx.shadowBlur = 10
          ctx.shadowColor = '#5cd0ae'
        } else {
          const alpha = 1 - (i / drop.chars.length)
          ctx.fillStyle = `rgba(92, 208, 174, ${alpha * 0.8})`
          ctx.shadowBlur = 0
        }

        ctx.font = `${fontSize}px monospace`
        ctx.fillText(char, drop.x, y)
      })

      drop.y += drop.speed

      // Reset when off screen
      if (drop.y > canvas.height) {
        drop.y = Math.random() * -200
        drop.speed = Math.random() * 2 + 1
      }
    })

    matrixAnimationId = requestAnimationFrame(drawMatrix)
  }

  drawMatrix()
}

// Hexagon Grid Effect
interface Hexagon {
  x: number
  y: number
  size: number
  opacity: number
  pulsePhase: number
  active: boolean
}

const initHexGrid = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const hexSize = 30
  const hexagons: Hexagon[] = []

  // Create hexagon grid
  const rows = Math.ceil(canvas.height / (hexSize * 1.5)) + 2
  const cols = Math.ceil(canvas.width / (hexSize * Math.sqrt(3))) + 2

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * hexSize * Math.sqrt(3) + (row % 2) * hexSize * Math.sqrt(3) / 2
      const y = row * hexSize * 1.5

      hexagons.push({
        x,
        y,
        size: hexSize,
        opacity: Math.random() * 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        active: Math.random() > 0.7
      })
    }
  }

  const drawHexagon = (hex: Hexagon) => {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i
      const x = hex.x + hex.size * Math.cos(angle)
      const y = hex.y + hex.size * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()

    // Calculate distance from mouse
    const dx = mouseX - hex.x
    const dy = mouseY - hex.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const maxDistance = 200

    if (distance < maxDistance) {
      const intensity = 1 - (distance / maxDistance)
      ctx.strokeStyle = `rgba(67, 170, 139, ${intensity * 0.8})`
      ctx.lineWidth = 2
      hex.active = true
    } else {
      const pulseOpacity = Math.sin(hex.pulsePhase) * 0.2 + 0.1
      ctx.strokeStyle = `rgba(67, 170, 139, ${hex.active ? pulseOpacity : 0.05})`
      ctx.lineWidth = 1
    }

    ctx.stroke()
  }

  const animateHex = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    hexagons.forEach(hex => {
      hex.pulsePhase += 0.02
      drawHexagon(hex)

      // Random activation
      if (Math.random() > 0.998) {
        hex.active = !hex.active
      }
    })

    hexAnimationId = requestAnimationFrame(animateHex)
  }

  animateHex()
}

// Data Packet Effect
interface Packet {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  trail: { x: number; y: number }[]
  encrypted: boolean
  decrypting: number
}

const initDataPackets = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const colors = ['#43AA8B', '#90BE6D', '#F8961E', '#F9C74F']
  const packets: Packet[] = []

  // Create packets
  for (let i = 0; i < 15; i++) {
    packets.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      trail: [],
      encrypted: true,
      decrypting: 0
    })
  }

  const drawPacket = (packet: Packet) => {
    // Draw trail
    ctx.strokeStyle = packet.color
    ctx.lineWidth = 1
    ctx.beginPath()
    packet.trail.forEach((point, i) => {
      const alpha = i / packet.trail.length
      ctx.globalAlpha = alpha * 0.5
      if (i === 0) ctx.moveTo(point.x, point.y)
      else ctx.lineTo(point.x, point.y)
    })
    ctx.stroke()
    ctx.globalAlpha = 1

    // Draw packet
    ctx.fillStyle = packet.color
    ctx.shadowBlur = 15
    ctx.shadowColor = packet.color

    if (packet.decrypting > 0) {
      // Decryption effect - pulsing
      const pulse = Math.sin(packet.decrypting * 0.2) * 2
      ctx.fillRect(
        packet.x - packet.size - pulse,
        packet.y - packet.size - pulse,
        (packet.size + pulse) * 2,
        (packet.size + pulse) * 2
      )
    } else {
      ctx.fillRect(packet.x - packet.size, packet.y - packet.size, packet.size * 2, packet.size * 2)
    }

    ctx.shadowBlur = 0
  }

  const animatePackets = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    packets.forEach(packet => {
      // Update position
      packet.x += packet.vx
      packet.y += packet.vy

      // Bounce off edges
      if (packet.x < 0 || packet.x > canvas.width) packet.vx *= -1
      if (packet.y < 0 || packet.y > canvas.height) packet.vy *= -1

      // Mouse interaction - attract packets
      const dx = mouseX - packet.x
      const dy = mouseY - packet.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) {
        packet.vx += dx * 0.0001
        packet.vy += dy * 0.0001
        packet.decrypting++
      } else {
        packet.decrypting = Math.max(0, packet.decrypting - 1)
      }

      // Limit speed
      const speed = Math.sqrt(packet.vx * packet.vx + packet.vy * packet.vy)
      if (speed > 3) {
        packet.vx = (packet.vx / speed) * 3
        packet.vy = (packet.vy / speed) * 3
      }

      // Update trail
      packet.trail.push({ x: packet.x, y: packet.y })
      if (packet.trail.length > 20) packet.trail.shift()

      drawPacket(packet)
    })

    packetAnimationId = requestAnimationFrame(animatePackets)
  }

  animatePackets()
}

// Mouse tracking
const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY

  // Update mouse effect position
  if (mouseEffect.value) {
    mouseEffect.value.style.left = `${mouseX}px`
    mouseEffect.value.style.top = `${mouseY}px`
  }
}

const handleResize = () => {
  if (matrixCanvas.value) {
    matrixCanvas.value.width = window.innerWidth
    matrixCanvas.value.height = window.innerHeight
  }
  if (hexCanvas.value) {
    hexCanvas.value.width = window.innerWidth
    hexCanvas.value.height = window.innerHeight
  }
  if (packetCanvas.value) {
    packetCanvas.value.width = window.innerWidth
    packetCanvas.value.height = window.innerHeight
  }
}

onMounted(() => {
  if (matrixCanvas.value) initMatrixRain(matrixCanvas.value)
  if (hexCanvas.value) initHexGrid(hexCanvas.value)
  if (packetCanvas.value) initDataPackets(packetCanvas.value)

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (matrixAnimationId) cancelAnimationFrame(matrixAnimationId)
  if (hexAnimationId) cancelAnimationFrame(hexAnimationId)
  if (packetAnimationId) cancelAnimationFrame(packetAnimationId)

  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.network-capture-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.matrix-rain,
.hex-grid,
.data-packets {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.matrix-rain {
  opacity: 0.3;
  z-index: 1;
}

.dark .matrix-rain {
  opacity: 0.4;
}

.hex-grid {
  opacity: 0.2;
  z-index: 2;
}

.dark .hex-grid {
  opacity: 0.3;
}

.data-packets {
  opacity: 0.6;
  z-index: 3;
}

.dark .data-packets {
  opacity: 0.8;
}

.mouse-encryption-effect {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 4;
  transform: translate(-50%, -50%);
}

.encryption-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #5cd0ae;
  border-radius: 50%;
  box-shadow: 0 0 10px #5cd0ae;
  animation: particleFloat 3s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    transform: translate(
      calc(var(--random-x, 100) * 1px),
      calc(var(--random-y, 100) * 1px)
    ) scale(0);
    opacity: 0;
  }
}

.encryption-particle:nth-child(1) { --random-x: 80; --random-y: -60; }
.encryption-particle:nth-child(2) { --random-x: -70; --random-y: 90; }
.encryption-particle:nth-child(3) { --random-x: 100; --random-y: 50; }
.encryption-particle:nth-child(4) { --random-x: -90; --random-y: -80; }
.encryption-particle:nth-child(5) { --random-x: 60; --random-y: 110; }
.encryption-particle:nth-child(6) { --random-x: -50; --random-y: -70; }
.encryption-particle:nth-child(7) { --random-x: 120; --random-y: -40; }
.encryption-particle:nth-child(8) { --random-x: -110; --random-y: 60; }
.encryption-particle:nth-child(9) { --random-x: 40; --random-y: -100; }
.encryption-particle:nth-child(10) { --random-x: -80; --random-y: 80; }
.encryption-particle:nth-child(11) { --random-x: 90; --random-y: -90; }
.encryption-particle:nth-child(12) { --random-x: -60; --random-y: 100; }
.encryption-particle:nth-child(13) { --random-x: 110; --random-y: 30; }
.encryption-particle:nth-child(14) { --random-x: -100; --random-y: -50; }
.encryption-particle:nth-child(15) { --random-x: 70; --random-y: -110; }
.encryption-particle:nth-child(16) { --random-x: -40; --random-y: 70; }
.encryption-particle:nth-child(17) { --random-x: 100; --random-y: -70; }
.encryption-particle:nth-child(18) { --random-x: -90; --random-y: 40; }
.encryption-particle:nth-child(19) { --random-x: 50; --random-y: 90; }
.encryption-particle:nth-child(20) { --random-x: -70; --random-y: -60; }

/* Reduce effects on mobile for performance */
@media (max-width: 768px) {
  .matrix-rain {
    opacity: 0.15;
  }

  .hex-grid {
    opacity: 0.1;
  }

  .data-packets {
    opacity: 0.3;
  }

  .mouse-encryption-effect {
    display: none;
  }
}
</style>

