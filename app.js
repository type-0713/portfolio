/**
 * ==============================================================================
 * JASURBEK ZOKIRJONOV - MAKTAB IT YETAKCHISI PORTFOLIO APPLICATION v2.0
 * Clean, Modular, High-Performance JavaScript
 * Features:
 *  - 3D Interactive Canvas Scene (Geometry + Particle physics)
 *  - Background Cyber Mesh Canvas
 *  - 3D Perspective Tilt on Cards
 *  - Web Audio API Sound Synthesizer
 *  - Project Filtering & Categories (10 Vercel Projects)
 *  - Electoral Manifest Interactive Tabs
 *  - "IT Start" Club Registration & Dynamic VIP Pass Generator
 *  - Massively Expanded Developer Shell Terminal Emulator (15+ commands, matrix rain, themes)
 *  - Suggestions & Community Feedback Board (Persistent via LocalStorage)
 *  - Certificate & Vercel Proof Modals
 * ==============================================================================
 */

// Global safe audio fallback
window.playUiSound = function(type = 'click') {};

function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[Portfolio Error in ${name}]:`, err);
  }
}

function initAll() {
  safeInit('AudioFX', initAudioFX);
  safeInit('BackgroundCanvas', initBackgroundCanvas);
  safeInit('Hero3DCanvas', initHero3DCanvas);
  safeInit('CardTilt', initCardTilt);
  safeInit('ManifestTabs', initManifestTabs);
  safeInit('ProjectFilters', initProjectFilters);
  safeInit('Modals', initModals);
  safeInit('Terminal', initTerminal);
  safeInit('Navigation', initNavigation);
  safeInit('ScrollProgress', initScrollProgressBar);
  safeInit('ScrollReveal', initScrollReveal);
  safeInit('Counters', initCounters);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  // DOM is already parsed in fast deploy or cached environment
  initAll();
}

// Window load safety fallback
window.addEventListener('load', () => {
  window.dispatchEvent(new Event('resize'));
});

/* ==============================================================================
   1. AUDIO SYNTHESIZER (WEB AUDIO API - ZERO EXTERNAL ASSETS REQUIRED)
   ============================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioFX() {
  const toggleBtn = document.getElementById('sound-toggle-btn');
  const soundLabel = document.getElementById('sound-label');
  const soundDot = document.getElementById('sound-dot');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playUiSound = function(type = 'click') {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        // Uplifting triad chime: C5, E5, G5, C6
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.15, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.35);
        });
      } else if (type === 'tab') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  const mobileToggleBtn = document.getElementById('mobile-sound-toggle-btn');

  function updateAudioUi() {
    if (soundEnabled) {
      if (soundLabel) soundLabel.textContent = "🔊 Tovush";
      if (soundDot) soundDot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
      if (mobileToggleBtn) mobileToggleBtn.innerHTML = "<span>🔊 Tovush: Yoqilgan</span>";
      window.playUiSound('success');
    } else {
      if (soundLabel) soundLabel.textContent = "🔇 Tovush";
      if (soundDot) soundDot.className = "w-2 h-2 rounded-full bg-slate-300";
      if (mobileToggleBtn) mobileToggleBtn.innerHTML = "<span>🔇 Tovush: O'chirilgan</span>";
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      updateAudioUi();
    });
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      updateAudioUi();
    });
  }
}

/* ==============================================================================
   2. BACKGROUND CYBER MESH CANVAS (LIGHT AMBIENT PARTICLES)
   ============================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width < 768 ? 25 : 55, 60);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1.2,
      baseColor: i % 2 === 0 ? 'rgba(37, 99, 235,' : 'rgba(99, 102, 241,'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.baseColor + ' 0.35)';
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 120) * 0.14;
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==============================================================================
   3. HERO 3D INTERACTIVE CANVAS SCENE (FUTURISTIC 3D ICOSAHEDRON & NODES)
   ============================================================================== */
function initHero3DCanvas() {
  const canvas = document.getElementById('interactive-3d-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement;
    const w = canvas.clientWidth || (parent ? parent.clientWidth : 0) || 360;
    const h = canvas.clientHeight || (parent ? parent.clientHeight : 0) || 256;
    if (w > 0 && h > 0) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
  }
  resize();
  window.addEventListener('resize', resize);
  if (window.ResizeObserver && canvas.parentElement) {
    try {
      new ResizeObserver(resize).observe(canvas.parentElement);
    } catch (_) {}
  }

  // 3D Icosahedron Vertices (Golden Ratio)
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVertices = [
    [-1,  phi,  0], [ 1,  phi,  0], [-1, -phi,  0], [ 1, -phi,  0],
    [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
    [ phi,  0, -1], [ phi,  0,  1], [-phi,  0, -1], [-phi,  0,  1]
  ];

  // Normalize vertices and scale
  const scale = 72;
  const vertices = rawVertices.map(v => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [ (v[0] / len) * scale, (v[1] / len) * scale, (v[2] / len) * scale ];
  });

  // Edges connecting vertices with distance threshold
  const edges = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dx = vertices[i][0] - vertices[j][0];
      const dy = vertices[i][1] - vertices[j][1];
      const dz = vertices[i][2] - vertices[j][2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < scale * 1.15) {
        edges.push([i, j]);
      }
    }
  }

  // Interactive Rotation Variables
  let rotX = 0.3;
  let rotY = 0.4;
  let targetRotX = 0.3;
  let targetRotY = 0.4;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    if (typeof window.playUiSound === 'function') {
      window.playUiSound('click');
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = (e.clientX - centerX) / rect.width;
        const offsetY = (e.clientY - centerY) / rect.height;
        if (isFinite(offsetX) && isFinite(offsetY)) {
          targetRotY += offsetX * 0.005;
          targetRotX += offsetY * 0.005;
        }
      }
      return;
    }
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    if (isFinite(deltaX) && isFinite(deltaY)) {
      targetRotY += deltaX * 0.01;
      targetRotX -= deltaY * 0.01;
    }
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches && e.touches.length > 0) {
      const deltaX = e.touches[0].clientX - lastMouseX;
      const deltaY = e.touches[0].clientY - lastMouseY;
      if (isFinite(deltaX) && isFinite(deltaY)) {
        targetRotY += deltaX * 0.01;
        targetRotX -= deltaY * 0.01;
      }
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Satellite orbiting particles
  const satellites = [];
  for (let i = 0; i < 16; i++) {
    satellites.push({
      orbitRadius: 95 + (i % 3) * 15,
      angle: (i / 16) * Math.PI * 2,
      speed: 0.015 + (i % 4) * 0.005,
      tilt: (i % 2 === 0 ? 1 : -1) * 0.45,
      color: i % 2 === 0 ? '#2563eb' : '#6366f1'
    });
  }

  function renderScene() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width === 0 || canvas.height === 0) {
      resize();
    }
    const w = (canvas.width / dpr) || 360;
    const h = (canvas.height / dpr) || 256;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    targetRotY += 0.006;

    // Safety checks against NaN
    if (!isFinite(targetRotX) || !isFinite(rotX)) { targetRotX = 0.3; rotX = 0.3; }
    if (!isFinite(targetRotY) || !isFinite(rotY)) { targetRotY = 0.4; rotY = 0.4; }
    targetRotX = Math.max(-1.5, Math.min(1.5, targetRotX));

    rotX += (targetRotX - rotX) * 0.1;
    rotY += (targetRotY - rotY) * 0.1;

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    function project(p) {
      const x1 = p[0] * cosY + p[2] * sinY;
      const y1 = p[1];
      const z1 = -p[0] * sinY + p[2] * cosY;

      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      const fov = 340;
      const scaleFactor = fov / (fov + z2);
      return {
        x: cx + x2 * scaleFactor,
        y: cy + y2 * scaleFactor,
        z: z2,
        scale: scaleFactor
      };
    }

    // Radial gradient glow
    const radialGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
    radialGlow.addColorStop(0, 'rgba(59, 130, 246, 0.22)');
    radialGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
    radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.fill();

    const projectedVertices = vertices.map(v => project(v));

    // Draw Edges
    for (const [i, j] of edges) {
      const v1 = projectedVertices[i];
      const v2 = projectedVertices[j];

      const avgZ = (v1.z + v2.z) / 2;
      const alpha = Math.max(0.2, (avgZ + scale) / (scale * 2));

      ctx.beginPath();
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v2.x, v2.y);
      ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.75})`;
      ctx.lineWidth = 1.6 * ((v1.scale + v2.scale) / 2);
      ctx.stroke();
    }

    // Draw Nodes
    for (const v of projectedVertices) {
      ctx.beginPath();
      ctx.arc(v.x, v.y, 4.5 * v.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#2563eb';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(v.x, v.y, 6.5 * v.scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Orbiting Satellites
    satellites.forEach(sat => {
      sat.angle += sat.speed;
      const sx = Math.cos(sat.angle) * sat.orbitRadius;
      const sy = Math.sin(sat.angle) * sat.orbitRadius * Math.sin(sat.tilt);
      const sz = Math.sin(sat.angle) * sat.orbitRadius * Math.cos(sat.tilt);

      const proj = project([sx, sy, sz]);

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 3 * proj.scale, 0, Math.PI * 2);
      ctx.fillStyle = sat.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 5.5 * proj.scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    requestAnimationFrame(renderScene);
  }

  renderScene();
}

/* ==============================================================================
   4. 3D PERSPECTIVE TILT EFFECT ON CARDS
   ============================================================================== */
function initCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (window.innerWidth < 768) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==============================================================================
   5. ELECTORAL MANIFEST INTERACTIVE TABS
   ============================================================================== */
function initManifestTabs() {
  const tabBtns = document.querySelectorAll('.manifest-tab-btn');
  const tabContents = document.querySelectorAll('.manifest-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      window.playUiSound('tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.add('hidden'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.classList.add('animate-scale-in');
      }
    });
  });
}

/* ==============================================================================
   6. PROJECT FILTERING & CATEGORIES
   ============================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      window.playUiSound('click');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.classList.add('animate-scale-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==============================================================================
   7. MODALS (CERTIFICATE & VERCEL PROOF INSPECTION)
   ============================================================================== */
function initModals() {
  const certModal = document.getElementById('cert-modal');
  const openCertBtn = document.getElementById('open-cert-modal-btn');
  const certClickPreview = document.getElementById('cert-click-preview');
  const closeCertBtn = document.getElementById('close-cert-modal');

  function openCert() {
    if (certModal) {
      certModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      window.playUiSound('click');
    }
  }

  function closeCert() {
    if (certModal) {
      certModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  if (openCertBtn) openCertBtn.addEventListener('click', openCert);
  if (certClickPreview) certClickPreview.addEventListener('click', openCert);
  if (closeCertBtn) closeCertBtn.addEventListener('click', closeCert);
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCert();
    });
  }

  const vercelModal = document.getElementById('vercel-modal');
  const openVercelBtn = document.getElementById('view-vercel-proof-btn');
  const closeVercelBtn = document.getElementById('close-vercel-modal');
  const closeVercelBottom = document.getElementById('close-vercel-modal-bottom');

  function openVercel() {
    if (vercelModal) {
      vercelModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      window.playUiSound('click');
    }
  }

  function closeVercel() {
    if (vercelModal) {
      vercelModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  if (openVercelBtn) openVercelBtn.addEventListener('click', openVercel);
  if (closeVercelBtn) closeVercelBtn.addEventListener('click', closeVercel);
  if (closeVercelBottom) closeVercelBottom.addEventListener('click', closeVercel);
  const evidenceViewCert = document.getElementById('evidence-view-cert');
  if (evidenceViewCert) evidenceViewCert.addEventListener('click', openCert);

  const evidenceViewVercel = document.getElementById('evidence-view-vercel');
  if (evidenceViewVercel) evidenceViewVercel.addEventListener('click', openVercel);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCert();
      closeVercel();
    }
  });
}

// Fullscreen Confetti Particle Generator
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 120;
  const particles = [];
  const colors = ['#2563eb', '#3b82f6', '#4f46e5', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 22,
      vy: (Math.random() - 0.7) * 20 - 4,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }

  let animationId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // Gravity
      p.vx *= 0.98; // Drag
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationId);
    }
  }

  animate();
}

/* ==============================================================================
   9. EXPANDED DEVELOPER SHELL TERMINAL EMULATOR (15+ COMMANDS & MATRIX FX)
   ============================================================================== */
function initTerminal() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const themeBtns = document.querySelectorAll('.term-theme-btn');
  const quickCmds = document.querySelectorAll('.term-quick-cmd');

  if (!form || !input || !output) return;

  let currentThemeColor = 'text-slate-300';

  // Theme changer
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      window.playUiSound('click');
      if (theme === 'green') currentThemeColor = 'text-emerald-400';
      else if (theme === 'cyan') currentThemeColor = 'text-cyan-400';
      else if (theme === 'amber') currentThemeColor = 'text-amber-400';
      else if (theme === 'purple') currentThemeColor = 'text-indigo-400';
      printLine(`<span class="${currentThemeColor}">✓ Terminal temasi o'zgartirildi: ${theme.toUpperCase()}</span>`);
    });
  });

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Quick Command buttons (direct execution, zero page reloads)
  quickCmds.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cmd = btn.textContent.trim();
      input.value = '';
      executeCommand(cmd);
    });
  });

  function printLine(text, className = currentThemeColor) {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  const quotes = [
    "«Eng yaxshi dasturchi — murakkab narsalarni oddiy qilib tushuntira olgan insondir.»",
    "«Bir kishi tez yurar, lekin jamoa uzoqqa borar. Biz maktabimiz IT jamoasi bilan uzoqqa boramiz!» — Jasurbek Zokirjonov",
    "«Amaliyot bilan mustahkamlanmagan bilim — mevasiz daraxt kabidir.»",
    "«Dasturlash — bu kelajak tili. Kim bugun kod yozishni o'rgansa, ertaga dunyoni boshqaradi.»"
  ];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawCmd = input.value;
    input.value = '';
    executeCommand(rawCmd);
  });

  function executeCommand(rawCmd) {
    if (!rawCmd) return;
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    printLine(`<span class="text-emerald-400 font-bold">jasurbek:~$</span> ${escapeHTML(trimmed)}`, 'text-slate-200');
    if (typeof window.playUiSound === 'function') {
      window.playUiSound('click');
    }

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (cmd) {
      case 'help':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div><span class="text-yellow-300 font-bold">=== MAVJUD BUYRUQLAR RO'YXATI ===</span></div>
            <div>• <span class="text-blue-400 font-bold">keys</span> / <span class="text-blue-400 font-bold">cases</span> - Maktab muammolari va ularning 5 ta real IT yechimi</div>
            <div>• <span class="text-amber-400 font-bold">audit</span> / <span class="text-amber-400 font-bold">dalillar</span> - Hakamlar va ekspertlar uchun ochiq dalillar portfeli</div>
            <div>• <span class="text-amber-400 font-bold">tuman</span> / <span class="text-amber-400 font-bold">bosqich</span> - Tuman bosqichi 2026 maqsadlari va missiyasi</div>
            <div>• <span class="text-amber-400 font-bold">compare</span> / <span class="text-amber-400 font-bold">raqiblar</span> - Jasurbek vs Raqiblar ob'yektiv taqqoslash jadvali</div>
            <div>• <span class="text-amber-400 font-bold">kubok</span> / <span class="text-amber-400 font-bold">champion</span> - Maktab bosqichi 1-o'rin kubogi va salyut</div>
            <div>• <span class="text-blue-400 font-bold">about</span> / <span class="text-blue-400 font-bold">bio</span> - Jasurbekning tarjimai holi va yetakchilik falsafasi</div>
            <div>• <span class="text-blue-400 font-bold">projects</span> - 10 ta Vercel loyihalari to'liq ro'yxati va domenlari</div>
            <div>• <span class="text-blue-400 font-bold">project &lt;nomi&gt;</span> - Loyiha haqida batafsil (masalan: project quiz, project 7buyuk)</div>
            <div>• <span class="text-blue-400 font-bold">skills</span> - Texnologiyalar foiz ko'rsatkichlari (ASCII progress bar)</div>
            <div>• <span class="text-blue-400 font-bold">cert</span> - Shift Academy Frontend sertifikati va baholari</div>
            <div>• <span class="text-blue-400 font-bold">vision</span> - Tuman IT Yetakchisi saylov dasturining 5 strategik ustuni</div>
            <div>• <span class="text-blue-400 font-bold">roadmap</span> - 4 oylik aniq muddatli harakatlar rejasi</div>
            <div>• <span class="text-blue-400 font-bold">partners</span> - Shift Academy, IT Park va Vercel ekosistemasi</div>
            <div>• <span class="text-blue-400 font-bold">matrix</span> - Yashil raqamli Matrix yomg'iri animatsiyasi</div>
            <div>• <span class="text-blue-400 font-bold">quote</span> - Dasturlash va yetakchilik aforizmlari</div>
            <div>• <span class="text-blue-400 font-bold">stats</span> - Dasturchining amaliy ko'rsatkichlari va faollik darajasi</div>
            <div>• <span class="text-blue-400 font-bold">contact</span> - Telegram, GitHub (type-0713) va aloqa manzillari</div>
            <div>• <span class="text-blue-400 font-bold">clear</span> - Terminal ekranini tozalash</div>
          </div>
        `);
        break;

      case 'about':
      case 'bio':
        printLine(`
          <div class="space-y-1.5 text-slate-300">
            <div class="text-cyan-300 font-bold">🌟 Jasurbek Zokirjonov Haqida:</div>
            <div>• <strong>Lavozim Nomzodi:</strong> Maktab IT Sohasi Yetakchisi (2026).</div>
            <div>• <strong>Maqsadi:</strong> Maktabimiz yoshlarini noldan kuchli dasturchi qilish, olimpiada g'oliblarini yetishtirish.</div>
            <div>• <strong>Ta'lim:</strong> Shift Academy "Frontend Web Development" kursi a'lochi bitiruvchisi.</div>
            <div>• <strong>Falsafasi:</strong> "Haqiqiy yetakchilik so'z bilan emas, 10 ta jonli ishlaydigan loyihalar kabi amaliy natija bilan o'lchanadi."</div>
          </div>
        `);
        break;

      case 'projects':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-emerald-400 font-bold">🚀 10 ta Haqiqiy Vercel Loyihalar:</div>
            <div>1. <span class="text-yellow-300">7-buyuk-shaxs</span> -> 7-buyuk-shaxs.vercel.app (3D Buxoro 7 Piri)</div>
            <div>2. <span class="text-yellow-300">kurs-platform</span> -> kurs-platform-nine.vercel.app (SEO Ta'lim Portali)</div>
            <div>3. <span class="text-yellow-300">quiz</span> -> quiz-8-sinf.vercel.app (Ravshan dostoni 3D Quiz)</div>
            <div>4. <span class="text-yellow-300">new-uzbekistan</span> -> yangi-uzbekistan.vercel.app (3D Tarix Portali)</div>
            <div>5. <span class="text-yellow-300">med-eliteuz</span> -> med-liteuz.vercel.app (Tibbiy Xizmatlar Portali)</div>
            <div>6. <span class="text-yellow-300">mentor.uz</span> -> mentoruz.vercel.app (Ustoz-Shogird Ta'lim Tizimi)</div>
            <div>7. <span class="text-yellow-300">photoeditor</span> -> photoeditor-three.vercel.app (Grafik Foto Studiya)</div>
            <div>8. <span class="text-yellow-300">rent-car</span> -> rent-car-ashen.vercel.app (Avtomobil Ijarasi Tizimi)</div>
            <div>9. <span class="text-yellow-300">rezumi-builder</span> -> rezumi-builder.vercel.app (CV Generator)</div>
            <div>10. <span class="text-yellow-300">habitify</span> -> habitify-pied.vercel.app (Odatlar va Intizom)</div>
            <div class="text-slate-400 text-xs mt-1">Har bir loyiha tafsilotlari uchun: <code class="text-emerald-300 font-bold">project &lt;nomi&gt;</code> (masalan: project quiz)</div>
          </div>
        `);
        break;

      case 'project':
        if (!arg) {
          printLine('<span class="text-rose-400">Iltimos, loyiha nomini kiriting: masalan: <code class="text-yellow-300 font-bold">project quiz</code> yoki <code class="text-yellow-300 font-bold">project 7buyuk</code></span>');
        } else if (arg.includes('quiz')) {
          printLine(`
            <div class="text-slate-300 space-y-1">
              <div class="text-blue-400 font-bold">📖 Loyiha: Ravshan dostoni 3D Quiz (8-sinf adabiyot)</div>
              <div>• Domen: https://quiz-8-sinf.vercel.app</div>
              <div>• GitHub: type-0713/quiz</div>
              <div>• Tavsif: Maktab o'quvchilari uchun dostonlarni interaktiv 3D savollar va viktorina orqali o'rgatuvchi tizim.</div>
              <div>• Texnologiyalar: Three.js, JavaScript, TailwindCSS, Gamification Engine.</div>
            </div>
          `);
        } else if (arg.includes('7buyuk') || arg.includes('shaxs')) {
          printLine(`
            <div class="text-slate-300 space-y-1">
              <div class="text-blue-400 font-bold">🕌 Loyiha: 7-buyuk-shaxs (Buxoro 7 Piri 3D Portali)</div>
              <div>• Domen: https://7-buyuk-shaxs.vercel.app</div>
              <div>• GitHub: type-0713/7BuyukShaxs</div>
              <div>• Tavsif: Allomalarimiz merosini 3D fazoda ko'rsatuvchi madaniy-tarixiy portal.</div>
              <div>• Texnologiyalar: React, Three.js 3D Models, Modern Responsive Web.</div>
            </div>
          `);
        } else if (arg.includes('habitify')) {
          printLine(`
            <div class="text-slate-300 space-y-1">
              <div class="text-blue-400 font-bold">⚡ Loyiha: Habitify (Odatlar va Intizom Nazorati)</div>
              <div>• Domen: https://habitify-pied.vercel.app</div>
              <div>• GitHub: type-0713/Habitify</div>
              <div>• Tavsif: O'quvchilarda kundalik kitob o'qish, dasturlash va sport odatlarini shakllantiruvchi platforma.</div>
            </div>
          `);
        } else {
          printLine(`<div class="text-slate-300">Loyiha '${arg}': Vercel serverlarida faol ishlab turibdi. Saytning '10 ta Real Loyiha' bo'limida jonli ko'rishingiz mumkin.</div>`);
        }
        break;

      case 'skills':
        printLine(`
          <div class="space-y-1 font-mono text-slate-300">
            <div class="text-yellow-300 font-bold">💻 TEXNOLOGIK KO'NIKMALAR & DARAJALAR:</div>
            <div>HTML5 / Semantic Web : [██████████] 98%</div>
            <div>CSS3 / TailwindCSS    : [██████████] 95%</div>
            <div>JavaScript (ES6+)     : [█████████░] 92%</div>
            <div>React.js / Next.js    : [█████████░] 89%</div>
            <div>Three.js & 3D WebGL   : [████████░░] 85%</div>
            <div>Git / GitHub / CI-CD  : [█████████░] 90%</div>
            <div>IT Mentorlik & Spiker : [█████████░] 94%</div>
          </div>
        `);
        break;

      case 'cert':
      case 'sertifikat':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-emerald-400 font-bold">🎓 Shift Academy Rasmiy Sertifikati:</div>
            <div>• Bitiruvchi: <strong>Zokirjonov Jasurbek</strong></div>
            <div>• Mutaxassislik: <strong>Frontend Web Development</strong></div>
            <div>• Ta'lim Markazi: <strong>SHIFT ACADEMY (shiftacademy.uz)</strong></div>
            <div>• Holati: Rasmiy muhrlangan, tekshiruvdan o'tgan va tasdiqlangan.</div>
            <div>• Asl nusxani saytning 'Sertifikat' bo'limida yuklab olishingiz mumkin.</div>
          </div>
        `);
        break;

      case 'vision':
      case 'saylov':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-cyan-300 font-bold">📋 Jasurbekning Saylov Dasturi:</div>
            <div>1. <strong>"IT Start" Bepul To'garagi:</strong> Har bir o'quvchiga HTML, CSS, JS o'rgatish.</div>
            <div>2. <strong>Olimpiada Jamoasi:</strong> Maktab terma jamoasini Respublika IT tanlovlariga tayyorlash.</div>
            <div>3. <strong>"Smart School":</strong> Maktab reytingi, elektron dars jadvali va QR kutubxona.</div>
            <div>4. <strong>Ustoz-Shogird:</strong> Quyi sinflarga iqtidorli o'quvchilar tomonidan mentorlik.</div>
            <div>5. <strong>AI Savodxonligi:</strong> Zamonaviy sun'iy intellektdan unumli va xavfsiz foydalanish.</div>
          </div>
        `);
        break;

      case 'roadmap':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-violet-300 font-bold">🗺️ 4 Oylik Amaliy Yo'l Xaritasi:</div>
            <div>• <strong>1-oy:</strong> Tashkiliy kengash va to'garakning ilk 50+ o'quvchisi.</div>
            <div>• <strong>2-oy:</strong> 30+ o'quvchi o'z vebsaytini internetga chiqaradi va mini-hakaton.</div>
            <div>• <strong>3-oy:</strong> Maktab onlayn portali va QR kutubxona joriy etiladi.</div>
            <div>• <strong>4-oy:</strong> Respublika IT olimpiadasida maktab terma jamoasi g'olibligi!</div>
          </div>
        `);
        break;

      case 'partners':
      case 'promo':
      case 'reklama':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-emerald-400 font-bold">🤝 Ekosistema Hamkorlari & IT Reklama:</div>
            <div>• <strong class="text-white">Shift Academy:</strong> Frontend dasturlash bo'yicha kuchli ta'lim (shiftacademy.uz)</div>
            <div>• <strong class="text-white">IT Park O'zbekiston:</strong> Yoshlar IT startaplari va laboratoriya bazasi</div>
            <div>• <strong class="text-white">Vercel Cloud:</strong> Global miqyosda 10 ta loyihaning 99.9% uptime bilan ishlashi</div>
            <div>• <strong class="text-white">One Million Uzbek Coders:</strong> Maktab o'quvchilariga xalqaro darajadagi bilimlar</div>
            <div>• <strong class="text-white">GitHub Education:</strong> O'quvchilarga bepul professional ishlab chiqish muhiti</div>
          </div>
        `);
        const promoSection = document.getElementById('partners-promo');
        if (promoSection) promoSection.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'matrix':
        printLine(`<span class="text-emerald-400 font-bold">Matrix oqimi faollashtirildi...</span>`);
        let counter = 0;
        const matrixInterval = setInterval(() => {
          const chars = '01JASURBEK_IT_LEADER_2026_THREEJS_REACT_FRONTEND';
          let line = '';
          for (let i = 0; i < 40; i++) {
            line += chars[Math.floor(Math.random() * chars.length)] + ' ';
          }
          printLine(`<span class="text-emerald-500 font-mono text-[11px]">${line}</span>`);
          counter++;
          if (counter > 8) {
            clearInterval(matrixInterval);
            printLine(`<span class="text-emerald-300 font-bold">✓ Tizim xavfsiz va to'liq himoyalangan.</span>`);
          }
        }, 80);
        break;

      case 'quote':
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        printLine(`<div class="text-amber-300 italic">${randomQuote}</div>`);
        break;

      case 'stats':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-blue-400 font-bold">📊 Dasturchi Ko'rsatkichlari:</div>
            <div>• Vercel Loyihalari: <strong>10 ta faol platforma</strong></div>
            <div>• Git Commitlar soni: <strong>150+ commit</strong></div>
            <div>• Maktabda qamrab olinadigan o'quvchilar: <strong>100+ o'quvchi</strong></div>
            <div>• Shift Academy o'quv soatlari: <strong>300+ soat chuqur amaliyot</strong></div>
          </div>
        `);
        break;

      case 'contact':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-emerald-400 font-bold">📬 Bog'lanish Manzillari:</div>
            <div>• GitHub: <a href="https://github.com/type-0713" target="_blank" class="text-blue-400 underline">https://github.com/type-0713</a></div>
            <div>• Shift Academy: <a href="https://shiftacademy.uz" target="_blank" class="text-blue-400 underline">https://shiftacademy.uz</a></div>
            <div>• Maktab: IT Kengashi va Yoshlar Ittifoqi binosi</div>
          </div>
        `);
        break;

      case 'keys':
      case 'cases':
      case 'muammo':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-blue-400 font-bold">💡 MAKTAB MUAMMOLARIGA 5 TA AMALIY IT YECHIM:</div>
            <div>1. <strong>Ravshan Dostoni 3D Quiz:</strong> Zerikarli doston yodlash o'rniga Three.js 3D o'yin.</div>
            <div>2. <strong>7-Buyuk-Shaxs 3D:</strong> Qog'oz kitoblar o'rniga allomalarning 3D madaniy portali.</div>
            <div>3. <strong>Kurs Platform:</strong> Qimmat kurslar o'rniga bepul ochiq ta'lim bazasi.</div>
            <div>4. <strong>Habitify:</strong> Behudaga chalg'ish o'rniga kundalik kitob va sport odatlari trekeri.</div>
            <div>5. <strong>Rezumi Builder:</strong> Tanlovlar va ishga hujjat topshirish uchun 3 daqiqada tayyor CV.</div>
          </div>
        `);
        const caseSec = document.getElementById('case-studies');
        if (caseSec) caseSec.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'audit':
      case 'dalillar':
      case 'isbot':
      case 'hakamlar':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-amber-300 font-bold">🔍 HAKAMLAR VA EKSPERTLAR UCHUN OCHIQ AUDIT PORTFELI:</div>
            <div>1. <strong>10 Ta Jonli Vercel Loyihasi:</strong> Global serverlarda 99.9% uptime bilan ishlamoqda.</div>
            <div>2. <strong>Shift Academy Diplomi:</strong> 300+ soatlik Frontend kursi, muhrli va tasdiqlangan.</div>
            <div>3. <strong>GitHub 1480+ Commitlar:</strong> (type-0713) toza manba kodlari to'liq ochiq.</div>
            <div>4. <strong>3D WebGL & Texnologiyalar:</strong> Three.js, React va Web Audio API.</div>
            <div>5. <strong>Google Search Console:</strong> Tasdiqlangan domen va 100/100 SEO indeksi.</div>
            <div class="text-emerald-400 font-bold pt-1">«Baholash sizdan — 100% amaliy dalillar va ochiq manbalar bizdan!»</div>
          </div>
        `);
        const auditSec = document.getElementById('evidence-audit');
        if (auditSec) auditSec.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'tuman':
      case 'bosqich':
      case 'district':
        printLine(`
          <div class="space-y-1.5 text-slate-300">
            <div class="text-amber-400 font-bold">🏆 TUMAN BOSQICHI 2026 — JASURBEKNING STRATEGIK MAQSADI:</div>
            <div>• <strong>Maktab G'olibi:</strong> Jasurbek maktab bosqichida 1-o'rinni mutlaq ustunlik bilan qo'lga kiritdi!</div>
            <div>• <strong>Tuman Missiyasi:</strong> Tumanimiz maktablari o'quvchilari uchun bepul IT ta'limi, maktablararo hakatonlar va kuchli olimpiada terma jamoasini tuzish.</div>
            <div>• <strong>Yakuniy Manzil:</strong> Viloyat va Respublika bosqichida tumanimiz nomini birinchi o'ringa olib chiqish!</div>
          </div>
        `);
        break;

      case 'compare':
      case 'raqiblar':
      case 'taqqoslash':
        printLine(`
          <div class="space-y-1 text-slate-300">
            <div class="text-blue-400 font-bold">⚔️ OB'YEKTIV TAQQOSLASH (JASURBEK VS RAQIBLAR):</div>
            <div>• <strong>Jonli Saytlar:</strong> Jasurbek: 10 ta Vercel platformasi | Raqiblar: 0 ta (faqat slaydlar)</div>
            <div>• <strong>Sertifikat:</strong> Jasurbek: Shift Academy Diplomi | Raqiblar: Rasmiy sertifikat yo'q</div>
            <div>• <strong>3D Innovatsiya:</strong> Jasurbek: Three.js WebGL & React | Raqiblar: Mavjud emas</div>
            <div>• <strong>GitHub:</strong> Jasurbek: 1480+ Commit (type-0713) | Raqiblar: Bo'sh akkaunt</div>
            <div class="text-emerald-400 font-bold">Xulosa: Birinchi qarashdayoq mutlaq ustunlik isbotlangan!</div>
          </div>
        `);
        const compSec = document.getElementById('comparison');
        if (compSec) compSec.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'kubok':
      case 'champion':
      case 'winner':
        printLine(`
          <div class="text-amber-400 font-mono text-xs leading-none py-1 whitespace-pre">
      ___________
     '._==_==_=_.'
     .-\\:      /-.
    | (|:.     |) |
     '-|:.     |-'
       \\::.    /
        '::. .'
          ) (
        _.' '._
       '-------'
          </div>
          <div class="text-amber-300 font-bold">🥇 1-O'RIN: MAKTAB BOSQICHI MUTLAQ G'OLIBI!</div>
          <div class="text-slate-300 text-xs">Jasurbek Zokirjonov — Tuman IT Cho'qqisini zabt etish sari olg'a!</div>
        `);
        if (typeof triggerConfettiBlast === 'function') triggerConfettiBlast();
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      default:
        printLine(`<span class="text-rose-400">Noma'lum buyruq: "${escapeHTML(rawCmd)}". Buyruqlar ro'yxatini ko'rish uchun <span class="text-yellow-300 font-bold">help</span> deb yozing.</span>`);
        break;
    }
  }
}

/* ==============================================================================
   10. NAVIGATION & ACTIVE SCROLL SPY
   ============================================================================== */
function initNavigation() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
      if (typeof window.playUiSound === 'function') window.playUiSound('click');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (typeof window.playUiSound === 'function') window.playUiSound('click');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  // Scroll Spy for Navbar
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==============================================================================
   11. SCROLL PROGRESS BAR (TOP GLOWING TRACKER)
   ============================================================================== */
function initScrollProgressBar() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      bar.style.width = '0%';
      return;
    }
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
    bar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}

/* ==============================================================================
   12. STAGGERED SCROLL REVEAL (INTERSECTION OBSERVER ENGINE)
   ============================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-init');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

/* ==============================================================================
   13. ANIMATED METRIC COUNTERS
   ============================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function animateCounter(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseInt(el.dataset.counter, 10);
    if (isNaN(target)) return;

    const duration = 1600;
    const startTime = performance.now();
    const prefix = el.dataset.counterPrefix || '';
    const suffix = el.dataset.counterSuffix || (el.innerText.includes('+') ? '+' : (el.innerText.includes('%') ? '%' : ''));

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.round(ease * target);
      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(c => animateCounter(c));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

