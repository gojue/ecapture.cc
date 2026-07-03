<script setup lang="ts">
import VueMasteryModal from './VueMasteryModal.vue';
import { ref, onMounted } from 'vue';

const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

// Animated encryption/decryption text
const encryptedChars = '▓▒░█▄▀■□◆◇★☆01';
const decryptedText = 'SSL/TLS text content';
const displayText = ref(decryptedText);

const animateText = () => {
  let iterations = 0;
  const maxIterations = 20;

  const interval = setInterval(() => {
    displayText.value = decryptedText
      .split('')
      .map((char, index) => {
        if (index < iterations) {
          return decryptedText[index];
        }
        return encryptedChars[Math.floor(Math.random() * encryptedChars.length)];
      })
      .join('');

    iterations += 1;

    if (iterations > maxIterations) {
      clearInterval(interval);
      displayText.value = decryptedText;
    }
  }, 50);
};

// Trigger animation on mount and periodically
onMounted(() => {
  setTimeout(animateText, 1000);
  setInterval(animateText, 8000);
});
</script>

<template>
  <section id="hero" :class="{ loaded: isLoaded }">
    <div class="hero-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>

      <!-- Encryption Data Stream -->
      <div class="data-stream-container">
        <div class="data-stream stream-1">
          <span v-for="n in 15" :key="`s1-${n}`" class="data-byte">{{ ['0x', 'FF', 'A3', '7C', 'B2', 'E9'][n % 6] }}</span>
        </div>
        <div class="data-stream stream-2">
          <span v-for="n in 15" :key="`s2-${n}`" class="data-byte">{{ ['CA', '8F', '1D', '5E', '92', '4B'][n % 6] }}</span>
        </div>
        <div class="data-stream stream-3">
          <span v-for="n in 15" :key="`s3-${n}`" class="data-byte">{{ ['3A', 'D7', '6C', 'F1', '8E', '2F'][n % 6] }}</span>
        </div>
      </div>

      <!-- Encryption Lock Icon with Pulse -->
      <div class="encryption-lock">
        <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M12 15v2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div class="lock-pulse"></div>
        <div class="lock-pulse delay-1"></div>
      </div>
    </div>

    <div class="hero-content">
      <div class="hero-badge">
        <span class="badge-icon">🔒</span>
        <span class="badge-text">eBPF-Powered Network Security</span>
      </div>

      <h1 class="tagline">
        <span class="tagline-line">Capture</span>
        <span class="accent decrypting-text">{{ displayText }}</span>
        <span class="tagline-line">without CA certificate</span>
      </h1>

      <div class="tech-divider">
        <span class="divider-line"></span>
        <span class="divider-dot"></span>
        <span class="divider-line"></span>
      </div>

      <p class="description">
        <span class="description-highlight">eBPF-powered</span> network packet capture and SSL/TLS decryption
        <br />
        <span class="platform-badges">
          <span class="platform-badge">Linux</span>
          <span class="platform-badge">Android</span>
          <span class="platform-badge">x86_64</span>
          <span class="platform-badge">ARM64</span>
        </span>
      </p>

      <p class="actions">
        <vue-mastery-modal />
        <a class="get-started tech-button" href="/en/1-introducing-ecapture/">
          <span class="button-content">
            <span class="button-text">Get Started</span>
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
          <span class="button-glow"></span>
        </a>
        <a id="github_download" class="setup tech-button-alt" href="/en/download" target="_blank">
          <span class="button-content">
            <svg class="download-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span class="button-text">Download</span>
          </span>
          <span class="button-glow"></span>
        </a>
      </p>

      <div class="hero-features">
        <div class="feature-item">
          <span class="feature-icon">⚡</span>
          <span class="feature-text">Zero CA Cert</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🛡️</span>
          <span class="feature-text">Kernel-Level</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔍</span>
          <span class="feature-text">Real-Time</span>
        </div>
      </div>
    </div>
  </section>

 </template>

<style scoped>
section {
  padding: 42px 32px;
}

#hero {
  position: relative;
  padding: 120px 32px 96px;
  text-align: center;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

#hero.loaded {
  opacity: 1;
  transform: translateY(0);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  top: -200px;
  left: -100px;
  background: radial-gradient(circle, #43AA8B 0%, transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  top: 100px;
  right: -100px;
  background: radial-gradient(circle, #F8961E 0%, transparent 70%);
  animation-delay: 2s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, #90BE6D 0%, transparent 70%);
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: var(--ec-c-teal-soft);
  border: 1px solid rgba(67, 170, 139, 0.3);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ec-c-teal);
  margin-bottom: 32px;
  animation: badge-pulse 2s ease-in-out infinite;
}

.dark .hero-badge {
  background: rgba(92, 208, 174, 0.15);
  border-color: rgba(92, 208, 174, 0.4);
  color: #5cd0ae;
  box-shadow: 0 0 20px rgba(92, 208, 174, 0.2);
}

@keyframes badge-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(67, 170, 139, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(67, 170, 139, 0);
  }
}

.badge-icon {
  font-size: 16px;
}

.tagline {
  font-size: 72px;
  line-height: 1.3;
  font-weight: 900;
  letter-spacing: -2px;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tagline-line {
  display: block;
  color: var(--vp-c-text-1);
}

.accent {
  display: block;
  background: linear-gradient(135deg, #43AA8B 0%, #90BE6D 50%, #F8961E 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  position: relative;
  animation: gradient-shift 3s ease infinite;
  background-size: 200% 200%;
}

.decrypting-text {
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
  text-shadow: 0 0 30px rgba(67, 170, 139, 0.5);
}

.dark .decrypting-text {
  text-shadow: 0 0 40px rgba(92, 208, 174, 0.7);
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Data Stream Effects */
.data-stream-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.15;
  pointer-events: none;
}

.dark .data-stream-container {
  opacity: 0.25;
}

.data-stream {
  position: absolute;
  display: flex;
  gap: 20px;
  white-space: nowrap;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: var(--ec-c-teal);
  animation: streamFlow 20s linear infinite;
}

.stream-1 {
  top: 20%;
  left: -100%;
  animation-duration: 25s;
}

.stream-2 {
  top: 50%;
  left: -100%;
  animation-duration: 30s;
  animation-delay: -10s;
}

.stream-3 {
  top: 70%;
  left: -100%;
  animation-duration: 35s;
  animation-delay: -20s;
}

.data-byte {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(67, 170, 139, 0.1);
  border: 1px solid rgba(67, 170, 139, 0.3);
  border-radius: 4px;
  opacity: 0;
  animation: byteAppear 2s ease-in-out infinite;
}

.dark .data-byte {
  background: rgba(92, 208, 174, 0.15);
  border-color: rgba(92, 208, 174, 0.4);
}

.data-byte:nth-child(odd) {
  animation-delay: 0.5s;
}

@keyframes streamFlow {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200vw);
  }
}

@keyframes byteAppear {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Encryption Lock */
.encryption-lock {
  position: absolute;
  top: 15%;
  right: 10%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  animation: lockFloat 4s ease-in-out infinite;
}

.dark .encryption-lock {
  opacity: 0.4;
}

.lock-icon {
  width: 50px;
  height: 50px;
  color: var(--ec-c-teal);
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 10px rgba(67, 170, 139, 0.5));
}

.dark .lock-icon {
  color: #5cd0ae;
  filter: drop-shadow(0 0 15px rgba(92, 208, 174, 0.7));
}

.lock-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--ec-c-teal);
  border-radius: 50%;
  animation: lockPulse 2s ease-out infinite;
  opacity: 0.6;
}

.lock-pulse.delay-1 {
  animation-delay: 1s;
}

@keyframes lockFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes lockPulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.tech-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 40px auto;
  max-width: 300px;
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--ec-c-teal), transparent);
}

.divider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ec-c-teal);
  box-shadow: 0 0 12px var(--ec-c-teal);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
}

.description {
  max-width: 800px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
  font-size: 20px;
  margin: 0 auto 20px;
}

.description-highlight {
  color: var(--ec-c-teal);
  font-weight: 600;
  position: relative;
}

.dark .description-highlight {
  color: #5cd0ae;
}

.platform-badges {
  display: inline-flex;
  gap: 8px;
  margin-top: 12px;
}

.platform-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--ec-c-teal-mute);
  border: 1px solid rgba(67, 170, 139, 0.2);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.dark .platform-badge {
  background: rgba(92, 208, 174, 0.1);
  border-color: rgba(92, 208, 174, 0.3);
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 48px auto 60px;
  flex-wrap: wrap;
}

.tech-button,
.tech-button-alt {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  border: none;
  text-decoration: none;
}

.tech-button {
  background: linear-gradient(135deg, #43AA8B 0%, #90BE6D 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(67, 170, 139, 0.4);
}

.tech-button-alt {
  background: linear-gradient(135deg, #F3722C 0%, #F8961E 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(243, 114, 44, 0.4);
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 14px 24px 14px 20px;
  width: 100%;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tech-button:hover,
.tech-button-alt:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(67, 170, 139, 0.5);
}

.tech-button-alt:hover {
  box-shadow: 0 8px 24px rgba(243, 114, 44, 0.5);
}

.tech-button:hover .button-glow,
.tech-button-alt:hover .button-glow {
  opacity: 1;
}

.icon,
.download-icon {
  transition: transform 0.3s ease;
}

.tech-button:hover .icon {
  transform: translateX(4px);
}

.tech-button-alt:hover .download-icon {
  transform: translateY(3px);
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 48px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-icon {
  font-size: 32px;
  filter: grayscale(0.3);
  transition: all 0.3s ease;
}

.feature-item:hover .feature-icon {
  filter: grayscale(0);
  transform: scale(1.2);
}

.feature-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 960px) {
  .tagline {
    font-size: 56px;
    letter-spacing: -1px;
  }
  .description {
    font-size: 18px;
  }
  .hero-features {
    gap: 32px;
  }
}

@media (max-width: 768px) {
  #hero {
    padding: 80px 24px 64px;
  }
  .tagline {
    font-size: 42px;
    letter-spacing: -0.5px;
  }
  .actions {
    flex-direction: column;
    align-items: center;
  }
  .tech-button,
  .tech-button-alt {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 576px) {
  .tagline {
    font-size: 36px;
  }
  .description {
    font-size: 16px;
  }
  .platform-badges {
    flex-wrap: wrap;
    justify-content: center;
  }
  .hero-features {
    gap: 24px;
  }
}

@media (max-width: 370px) {
  .tagline {
    font-size: 32px;
  }
}

</style>
