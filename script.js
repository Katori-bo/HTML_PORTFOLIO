/**
 * Aditya Tiwari Portfolio — Aura Bora Inspired Interactive Engine
 * Physics, 3D Tilt, Scroll-Reveal, Magnetic Buttons, Sparkle Cursor,
 * Collectible Media Shelf & Reddit Community Reviews
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.textContent = isOpen ? '✕ CLOSE' : '☰ MENU';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '☰ MENU';
      });
    });
  }

  // 2. Dynamic Year
  const yearElement = document.querySelector('[data-current-year]');
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // 2b. Auto-hiding Sticky Header on Scroll
  // 2b. Auto-hiding Sticky Header on Scroll + Windows Taskbar-style Reveal on Top Mouse Proximity
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    let lastScrollY = window.scrollY || 0;
    let isHoveringTop = false;
    const scrollThreshold = 8;

    // Windows Taskbar behavior: Reveal immediately when mouse moves near top of viewport anywhere on page
    window.addEventListener('mousemove', (e) => {
      const curY = window.scrollY || 0;
      if (curY > 50) {
        if (e.clientY <= 80) {
          if (!isHoveringTop) {
            isHoveringTop = true;
            siteHeader.classList.remove('nav-hidden');
          }
        } else if (isHoveringTop && e.clientY > 95) {
          isHoveringTop = false;
          siteHeader.classList.add('nav-hidden');
        }
      }
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const curY = window.scrollY || 0;
      if (curY <= 50) {
        siteHeader.classList.remove('nav-hidden');
        isHoveringTop = false;
      } else if (!isHoveringTop) {
        if (curY > lastScrollY + scrollThreshold) {
          siteHeader.classList.add('nav-hidden');
        } else if (curY < lastScrollY - scrollThreshold) {
          siteHeader.classList.remove('nav-hidden');
        }
      }
      lastScrollY = curY;
    }, { passive: true });
  }

  // 3. Tactile Toast Notification
  window.showToast = function (message) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>★</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  };

  // 4. 1-Click Email Copy
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-copy-email') || 'aadityabagiballia@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        window.showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        window.showToast(`Email: ${email}`);
      });
    });
  });

  // 5. Aura Bora Inspired Sparkle Cursor Mode Toggle
  const cursorToggleBtn = document.querySelector('#cursorToggleBtn');
  let isSparkleActive = false;

  if (cursorToggleBtn) {
    cursorToggleBtn.addEventListener('click', () => {
      isSparkleActive = !isSparkleActive;
      document.body.classList.toggle('sparkle-cursor-active', isSparkleActive);
      window.showToast(isSparkleActive ? 'Sparkle Cursor: ON ✨' : 'Sparkle Cursor: OFF');
    });

    // Spawn tiny sparkle trail when moving
    window.addEventListener('mousemove', (e) => {
      if (!isSparkleActive) return;
      if (Math.random() > 0.55) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = `${Math.floor(Math.random() * 12 + 10)}px`;
        sparkle.style.zIndex = '99999';
        sparkle.style.userSelect = 'none';
        sparkle.textContent = ['✦', '✨', '✸', '★', '🌿'][Math.floor(Math.random() * 5)];
        sparkle.style.transition = 'all 0.6s ease-out';
        sparkle.style.transform = 'translate(-50%, -50%) scale(1)';
        document.body.appendChild(sparkle);

        requestAnimationFrame(() => {
          sparkle.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0.2)`;
          sparkle.style.opacity = '0';
        });

        setTimeout(() => {
          sparkle.remove();
        }, 600);
      }
    });
  }

  // 6. Physics: Scroll-Driven Reveal Animations (IntersectionObserver)
  const targetsToReveal = document.querySelectorAll(
    '.scroll-reveal, .flavor-card, .ingredient-box, .nutrition-card, .archive-hub-box, .beyond-portal-arch, .contact-marquee-card'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targetsToReveal.forEach((el) => {
      el.classList.add('scroll-reveal');
      revealObserver.observe(el);
    });
  } else {
    targetsToReveal.forEach((el) => el.classList.add('is-revealed'));
  }

  // 7. Physics: Magnetic Button Pull Effect
  const magneticButtons = document.querySelectorAll('.btn-tactile, .tool-icon-btn, .contact-pill-btn');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // 8. Physics: 3D Interactive Card Tilt
  function attachTiltPhysics(cards) {
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translate(-2px, -3px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  attachTiltPhysics(document.querySelectorAll('.flavor-card, .archive-hub-box, .nutrition-card'));

  // 9. Physics: Parallax Floating Decorative Stickers
  const stickers = document.querySelectorAll('.sticker, .archive-kanji-watermark');
  if (stickers.length > 0) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          stickers.forEach((stk, i) => {
            const shift = Math.sin(scrollY * 0.003 + i) * 5;
            stk.style.transform = `translateY(${shift}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 10. Smooth Page Transitions for Internal Links
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank'
    ) {
      return;
    }
    link.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      document.body.classList.add('page-fade-out');
      setTimeout(() => {
        window.location.href = href;
      }, 160);
    });
  });

  // =========================================================================
  // 11. Mountain & Jungle Road Expedition Engine (Option A)
  // =========================================================================
  const expeditionTrack = document.getElementById('expeditionTrack');
  const roverRig = document.getElementById('roverRig');
  const expeditionWorld = document.getElementById('expeditionWorld');
  const odoMeter = document.getElementById('odoMeter');
  const speedMeter = document.getElementById('speedMeter');
  const headlightCone = document.getElementById('headlightCone');
  const waypoints = document.querySelectorAll('.expedition-waypoint');
  const wheels = document.querySelectorAll('.wheel-rotator');

  if (expeditionTrack && roverRig && expeditionWorld) {
    let targetProgress = 0;
    let currentProgress = 0;
    let lastProgress = 0;
    let isHighBeamOn = false;

    // Track scroll position relative to expedition track
    window.addEventListener('scroll', () => {
      const rect = expeditionTrack.getBoundingClientRect();
      const trackHeight = expeditionTrack.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / trackHeight));
      targetProgress = progress;
    }, { passive: true });

    // Keyboard driving controls
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetProgress = Math.min(1, targetProgress + 0.015);
        syncScrollToProgress(targetProgress);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetProgress = Math.max(0, targetProgress - 0.015);
        syncScrollToProgress(targetProgress);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleHighBeams();
      }
    });

    function syncScrollToProgress(p) {
      const trackTop = expeditionTrack.offsetTop;
      const trackHeight = expeditionTrack.offsetHeight - window.innerHeight;
      window.scrollTo({ top: trackTop + p * trackHeight, behavior: 'auto' });
    }

    function toggleHighBeams() {
      isHighBeamOn = !isHighBeamOn;
      if (headlightCone) {
        headlightCone.style.transform = isHighBeamOn ? 'scale(1.4)' : 'scale(1)';
        headlightCone.style.opacity = isHighBeamOn ? '1' : '0.75';
      }
      window.showToast(isHighBeamOn ? 'High Beams: ON 💡' : 'Low Beams: ON');
    }

    window.driveForward = () => {
      targetProgress = Math.min(1, targetProgress + 0.06);
      syncScrollToProgress(targetProgress);
    };

    // Parallax background layers
    const layerMount1 = document.getElementById('layerMount1');
    const layerMount2 = document.getElementById('layerMount2');
    const layerFoothills = document.getElementById('layerFoothills');
    const layerJungleBack = document.getElementById('layerJungleBack');
    const layerJungleFront = document.getElementById('layerJungleFront');

    // Kinematic Animation Loop (Damped Lerp)
    function expeditionFrame() {
      const delta = (targetProgress - currentProgress) * 0.08;
      currentProgress += delta;

      // Calculate speed and braking
      const speed = Math.abs(currentProgress - lastProgress);
      const speedMph = Math.min(65, Math.round(speed * 3200));

      if (speedMeter) {
        speedMeter.textContent = `${speedMph} MPH`;
      }
      if (odoMeter) {
        const miles = (currentProgress * 4.0).toFixed(1);
        odoMeter.textContent = `MILE ${miles} / 4.0`;
      }

      // Taillight flare on deceleration / stop
      const isBraking = speed < 0.0003 && currentProgress > 0.005;
      roverRig.classList.toggle('braking', isBraking);

      // Wheel rotation
      const wheelRot = (currentProgress * 4800) % 360;
      wheels.forEach((w) => {
        w.style.transform = `rotate(${wheelRot}deg)`;
      });

      // World horizontal translation (total drive distance: 3400px)
      const worldDist = currentProgress * 3400;
      expeditionWorld.style.transform = `translate3d(${-worldDist}px, 0, 0)`;

      // Multi-layer optical parallax translation
      if (layerMount1) layerMount1.style.transform = `translate3d(${-worldDist * 0.08}px, 0, 0)`;
      if (layerMount2) layerMount2.style.transform = `translate3d(${-worldDist * 0.16}px, 0, 0)`;
      if (layerFoothills) layerFoothills.style.transform = `translate3d(${-worldDist * 0.28}px, 0, 0)`;
      if (layerJungleBack) layerJungleBack.style.transform = `translate3d(${-worldDist * 0.48}px, 0, 0)`;
      if (layerJungleFront) layerJungleFront.style.transform = `translate3d(${-worldDist * 0.72}px, 0, 0)`;

      // Waypoint proximity activation
      const roverScreenX = roverRig.getBoundingClientRect().left + 65;
      waypoints.forEach((wp) => {
        const wpRect = wp.getBoundingClientRect();
        const distToRover = Math.abs(wpRect.left + wpRect.width / 2 - roverScreenX);
        const isActive = distToRover < 190;
        wp.classList.toggle('is-active-checkpoint', isActive);
      });

      lastProgress = currentProgress;
      requestAnimationFrame(expeditionFrame);
    }
    requestAnimationFrame(expeditionFrame);

    // Solar Time-of-Day Theming Engine
    function applySolarTheme(forcedTheme) {
      document.body.classList.remove('theme-dawn', 'theme-day', 'theme-dusk', 'theme-night');
      if (forcedTheme && forcedTheme !== 'live') {
        document.body.classList.add(`theme-${forcedTheme}`);
        window.showToast(`Sky: ${forcedTheme.toUpperCase()}`);
        return;
      }

      const hour = new Date().getHours();
      let calculated = 'day';
      if (hour >= 5 && hour < 8) calculated = 'dawn';
      else if (hour >= 8 && hour < 17) calculated = 'day';
      else if (hour >= 17 && hour < 20) calculated = 'dusk';
      else calculated = 'night';

      document.body.classList.add(`theme-${calculated}`);
      window.showToast(`Local Sky: ${calculated.toUpperCase()} (IST)`);
    }

    applySolarTheme('live');

    document.querySelectorAll('[data-solar-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-solar-theme');
        applySolarTheme(theme);
      });
    });

    // Synthesized Pink Noise Ambient Breeze (Web Audio API)
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    let audioCtx = null;
    let windNoiseNode = null;

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
          }
        }

        if (!audioCtx) return;

        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        if (!windNoiseNode) {
          const bufferSize = audioCtx.sampleRate * 2;
          const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.04;
            b6 = white * 0.115926;
          }

          const noise = audioCtx.createBufferSource();
          noise.buffer = noiseBuffer;
          noise.loop = true;

          const filter = audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(350, audioCtx.currentTime);

          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);
          noise.start();
          windNoiseNode = { source: noise, gain: gain };

          soundToggleBtn.textContent = '🔊 Audio: ON';
          window.showToast('Mountain Ambient: ON 🍃');
        } else {
          windNoiseNode.source.stop();
          windNoiseNode.disconnect();
          windNoiseNode = null;
          soundToggleBtn.textContent = '🔇 Audio: OFF';
          window.showToast('Mountain Ambient: OFF');
        }
      });
    }
  }

  // Global Quick Spec Slide-Out Drawer (Available on all pages)
  const quickSpecBtn = document.getElementById('quickSpecBtn');
  const quickSpecDrawer = document.getElementById('quickSpecDrawer');
  const quickSpecBackdrop = document.getElementById('quickSpecBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  function toggleQuickSpec(open) {
    quickSpecDrawer?.classList.toggle('is-open', open);
    quickSpecBackdrop?.classList.toggle('is-visible', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  quickSpecBtn?.addEventListener('click', () => toggleQuickSpec(true));
  closeDrawerBtn?.addEventListener('click', () => toggleQuickSpec(false));
  quickSpecBackdrop?.addEventListener('click', () => toggleQuickSpec(false));

  // =========================================================================
  // 12a. Hero Translucent Frosted Glass & Illuminated Grid Squares Engine
  // =========================================================================
  const heroSection = document.getElementById('hero');
  const heroGridCanvas = document.getElementById('heroGridCanvas');

  if (heroSection && heroGridCanvas) {
    const hctx = heroGridCanvas.getContext('2d');
    let hw = 0;
    let hh = 0;
    let hdpr = window.devicePixelRatio || 1;
    let targetX = -1000;
    let targetY = -1000;
    let curX = -1000;
    let curY = -1000;
    let isMouseInside = false;

    const gridSize = 50; // Crisp square cell size matching the hero aesthetic
    let cols = 0;
    let rows = 0;
    let cellIntensities = [];
    let cellColors = [];

    const vibrantPalette = [
      '#4ade80', // Transform9 Lime
      '#38bdf8', // Cyan
      '#2563eb', // Royal Blue
      '#a855f7', // Violet
      '#f43f5e', // Rose
      '#faf6ee'  // White/Cream
    ];

    function resizeHeroGrid() {
      hdpr = window.devicePixelRatio || 1;
      hw = heroSection.offsetWidth;
      hh = heroSection.offsetHeight;
      heroGridCanvas.width = hw * hdpr;
      heroGridCanvas.height = hh * hdpr;
      hctx.scale(hdpr, hdpr);

      cols = Math.ceil(hw / gridSize);
      rows = Math.ceil(hh / gridSize);

      cellIntensities = [];
      cellColors = [];
      for (let c = 0; c < cols; c++) {
        cellIntensities[c] = [];
        cellColors[c] = [];
        for (let r = 0; r < rows; r++) {
          cellIntensities[c][r] = 0;
          const hash = (c * 37 + r * 61 + (c ^ r) * 13) % vibrantPalette.length;
          cellColors[c][r] = vibrantPalette[hash];
        }
      }
    }

    window.addEventListener('resize', resizeHeroGrid);
    resizeHeroGrid();

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!isMouseInside) {
        curX = targetX;
        curY = targetY;
        isMouseInside = true;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      isMouseInside = false;
    });

    let glassTime = 0;
    function renderHeroGrid() {
      glassTime += 0.02;

      if (isMouseInside) {
        curX += (targetX - curX) * 0.09;
        curY += (targetY - curY) * 0.09;
      } else {
        // Gentle organic floating light path when idle
        curX = hw * 0.50 + Math.sin(glassTime * 0.6) * (hw * 0.28);
        curY = hh * 0.44 + Math.cos(glassTime * 0.45) * (hh * 0.22);
      }

      hctx.clearRect(0, 0, hw, hh);

      // 1. Draw base square grid lines
      hctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      hctx.lineWidth = 1;
      hctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = c * gridSize;
        hctx.moveTo(x, 0);
        hctx.lineTo(x, hh);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * gridSize;
        hctx.moveTo(0, y);
        hctx.lineTo(hw, y);
      }
      hctx.stroke();

      // 2. Light up grid squares under and around the moving light source
      const radius = 280;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const sqCenterX = c * gridSize + gridSize / 2;
          const sqCenterY = r * gridSize + gridSize / 2;
          const dist = Math.hypot(sqCenterX - curX, sqCenterY - curY);

          let targetInt = 0;
          if (dist < radius) {
            targetInt = Math.pow(Math.max(0, 1 - dist / radius), 1.5);
          }

          if (targetInt > cellIntensities[c][r]) {
            cellIntensities[c][r] = targetInt;
          } else {
            cellIntensities[c][r] *= 0.93; // Smooth decaying trail of lit squares
          }

          const currentInt = cellIntensities[c][r];
          if (currentInt > 0.015) {
            const colorHex = cellColors[c][r];
            const x = c * gridSize;
            const y = r * gridSize;

            // Fill illuminated square with color and alpha
            hctx.fillStyle = colorHex;
            hctx.globalAlpha = Math.min(0.85, currentInt * 0.95);
            hctx.fillRect(x + 1.5, y + 1.5, gridSize - 3, gridSize - 3);

            // Crisp neon border for lit squares
            hctx.strokeStyle = '#ffffff';
            hctx.globalAlpha = Math.min(0.65, currentInt * 0.75);
            hctx.lineWidth = 1.2;
            hctx.strokeRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
          }
        }
      }
      hctx.globalAlpha = 1.0;

      // 3. Moving Glowing Square Core behind the frosted glass
      const sqSize = gridSize - 4; // Crisp square tile matching grid geometry (46px)
      const halfSq = sqSize / 2;

      // A. Layered geometric square aura radiating outward
      const auraSteps = [
        { scale: 3.4, alpha: 0.10, color: '#4ade80' },
        { scale: 2.3, alpha: 0.20, color: '#38bdf8' },
        { scale: 1.5, alpha: 0.32, color: '#4ade80' }
      ];
      auraSteps.forEach((step) => {
        const aSize = sqSize * step.scale;
        hctx.save();
        hctx.fillStyle = step.color;
        hctx.globalAlpha = step.alpha;
        hctx.shadowColor = step.color;
        hctx.shadowBlur = 32;
        hctx.fillRect(curX - aSize / 2, curY - aSize / 2, aSize, aSize);
        hctx.restore();
      });

      // B. Primary moving glowing square tile
      hctx.save();
      hctx.globalAlpha = 0.95;
      hctx.fillStyle = '#4ade80';
      hctx.shadowColor = '#4ade80';
      hctx.shadowBlur = 24;
      hctx.fillRect(curX - halfSq, curY - halfSq, sqSize, sqSize);

      // C. Luminous inner square frame
      hctx.fillStyle = '#ffffff';
      hctx.globalAlpha = 0.85;
      hctx.fillRect(curX - halfSq + 4, curY - halfSq + 4, sqSize - 8, sqSize - 8);

      // D. Inner neon core
      hctx.fillStyle = '#22c55e';
      hctx.globalAlpha = 0.95;
      hctx.fillRect(curX - halfSq + 8, curY - halfSq + 8, sqSize - 16, sqSize - 16);

      // E. Crisp high-contrast white border
      hctx.strokeStyle = '#ffffff';
      hctx.lineWidth = 1.5;
      hctx.globalAlpha = 1.0;
      hctx.strokeRect(curX - halfSq, curY - halfSq, sqSize, sqSize);
      hctx.restore();

      requestAnimationFrame(renderHeroGrid);
    }
    requestAnimationFrame(renderHeroGrid);
  }

  // =========================================================================
  // 12b. Transform9 Signature Jagged Voxel Pixel Transition Engine (Down & UP)
  // =========================================================================
  const pixelScrollTrack = document.getElementById('pixelScrollTrack');
  const pixelBoundary = document.getElementById('pixelBoundary');
  const pixelWaveCanvas = document.getElementById('pixelWaveCanvas');

  if (pixelBoundary && pixelWaveCanvas) {
    const pctx = pixelWaveCanvas.getContext('2d');
    let pw = 0;
    let ph = 0;
    let pdpr = window.devicePixelRatio || 1;
    let blockSize = 120;
    let cols = 0;
    let fringeMap = [];
    let boundaryMouseX = -1000;
    let boundaryMouseY = -1000;

    let targetProgress = 0;
    let currentProgress = 0;

    // Helper functions for smooth block color resolution into bottom screen cream (#faf6ee)
    function hexToRgb(hex) {
      const clean = hex.replace('#', '');
      if (clean.length === 3) {
        const r = parseInt(clean[0] + clean[0], 16);
        const g = parseInt(clean[1] + clean[1], 16);
        const b = parseInt(clean[2] + clean[2], 16);
        return [r, g, b];
      }
      const num = parseInt(clean, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }

    function lerpColor(c1Hex, c2Hex, t) {
      if (t <= 0) return c1Hex;
      if (t >= 1) return c2Hex;
      const [r1, g1, b1] = hexToRgb(c1Hex);
      const [r2, g2, b2] = hexToRgb(c2Hex);
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    // Smooth scroll progress mapped through track entrance and pinned scroll
    function updateTransitionProgress() {
      const track = pixelScrollTrack || pixelBoundary;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const trackHeight = track.offsetHeight;

      const startY = vh * 0.85;
      const endY = -(trackHeight - vh);
      const scrollRange = Math.max(1, startY - endY);
      const rawP = (startY - rect.top) / scrollRange;
      targetProgress = Math.max(0, Math.min(1, rawP));
    }

    window.addEventListener('scroll', updateTransitionProgress, { passive: true });
    window.addEventListener('resize', updateTransitionProgress, { passive: true });
    updateTransitionProgress();

    window.addEventListener('mousemove', (e) => {
      const rect = pixelBoundary.getBoundingClientRect();
      boundaryMouseX = e.clientX - rect.left;
      boundaryMouseY = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      boundaryMouseX = -1000;
      boundaryMouseY = -1000;
    });

    function resizePixelWave() {
      pdpr = window.devicePixelRatio || 1;
      pw = pixelBoundary.offsetWidth;
      ph = pixelBoundary.offsetHeight;
      pixelWaveCanvas.width = pw * pdpr;
      pixelWaveCanvas.height = ph * pdpr;
      pctx.scale(pdpr, pdpr);

      // BIG CHUNKY SQUARES: 10-12 columns on desktop (~120-140px blocks), 8 on tablet, 5 on mobile
      const targetCols = pw < 600 ? 5 : (pw < 1024 ? 8 : 10);
      blockSize = Math.ceil(pw / targetCols);
      cols = Math.ceil(pw / blockSize);

      // 4-6 blocks in depth for dramatic voxel landscape
      const stepHeights = [5, 6, 4, 6, 5, 4, 6, 5, 6, 4];
      const colorPalettes = [
        ['#faf6ee', '#2563eb', '#4ade80', '#090c0a', '#4ade80', '#faf6ee', '#2563eb'],
        ['#090c0a', '#090c0a', '#4ade80', '#2563eb', '#faf6ee', '#4ade80', '#090c0a'],
        ['#2563eb', '#faf6ee', '#faf6ee', '#4ade80', '#090c0a', '#2563eb', '#faf6ee'],
        ['#faf6ee', '#2563eb', '#090c0a', '#4ade80', '#4ade80', '#faf6ee', '#2563eb'],
        ['#2563eb', '#4ade80', '#faf6ee', '#2563eb', '#090c0a', '#4ade80', '#faf6ee'],
        ['#4ade80', '#faf6ee', '#faf6ee', '#faf6ee', '#2563eb', '#090c0a', '#4ade80'],
        ['#2563eb', '#4ade80', '#faf6ee', '#090c0a', '#4ade80', '#2563eb', '#faf6ee'],
        ['#faf6ee', '#090c0a', '#2563eb', '#4ade80', '#faf6ee', '#090c0a', '#4ade80'],
        ['#090c0a', '#090c0a', '#2563eb', '#4ade80', '#faf6ee', '#4ade80', '#2563eb'],
        ['#2563eb', '#4ade80', '#4ade80', '#faf6ee', '#090c0a', '#2563eb', '#faf6ee']
      ];

      fringeMap = [];
      for (let c = 0; c < cols; c++) {
        const heightInBlocks = stepHeights[c % stepHeights.length];
        const colors = colorPalettes[c % colorPalettes.length];
        fringeMap.push({ heightInBlocks, colors });
      }
    }

    window.addEventListener('resize', resizePixelWave);
    resizePixelWave();

    let waveTime = 0;
    function renderPixelWave() {
      waveTime += 0.02;

      // Responsive momentum lerp
      const delta = (targetProgress - currentProgress) * 0.08;
      currentProgress += delta;
      if (Math.abs(targetProgress - currentProgress) < 0.0002) {
        currentProgress = targetProgress;
      }

      // If transition is fully completed (scrolled to end of sticky track), render solid flat cream
      if (currentProgress >= 0.98) {
        pctx.fillStyle = '#faf6ee';
        pctx.fillRect(0, 0, pw, ph);
        requestAnimationFrame(renderPixelWave);
        return;
      }

      // 1. Fill entire canvas with dark hero black (#090c0a) to seamlessly match the hero
      pctx.fillStyle = '#090c0a';
      pctx.fillRect(0, 0, pw, ph);

      // Base Y of the solid cream deck:
      // Starts just below bottom of canvas (ph + blockSize * 1.5), rises smoothly to ph * 0.38
      const initialBaseY = ph + blockSize * 1.5;
      const finalBaseY = ph * 0.38;
      const currentDeckY = initialBaseY - (initialBaseY - finalBaseY) * currentProgress;

      // Calculate column deck heights and wave delays
      const colDeckYs = [];
      let maxDeckY = -10000;
      for (let c = 0; c < cols; c++) {
        const colDelay = Math.sin((c / cols) * Math.PI) * 0.15 + (c / cols) * 0.1;
        const colProgress = Math.max(0, Math.min(1, (currentProgress - colDelay * 0.2) / 0.8));
        const ripple = Math.sin(waveTime + c * 0.5) * 3;
        const colDeckY = currentDeckY + ripple;
        colDeckYs.push({ colDeckY, colProgress });
        if (colDeckY > maxDeckY) maxDeckY = colDeckY;
      }

      // 2. Draw solid cream deck base across full width
      pctx.fillStyle = '#faf6ee';
      if (maxDeckY < ph) {
        pctx.fillRect(0, Math.max(0, maxDeckY - 1), pw, ph - Math.max(0, maxDeckY - 1) + 2);
      }

      // Draw stepped column deck fills
      for (let c = 0; c < cols; c++) {
        const x = c * blockSize;
        const { colDeckY } = colDeckYs[c];
        if (colDeckY < maxDeckY && colDeckY < ph) {
          pctx.fillRect(x - 1, colDeckY, blockSize + 2, maxDeckY - colDeckY + 2);
        }
      }

      // 3. Draw chunky stepped fringe blocks rising ahead of the cream deck
      for (let c = 0; c < cols; c++) {
        const x = c * blockSize;
        const config = fringeMap[c] || { heightInBlocks: 5, colors: colorPalettes[0] };
        const { colDeckY, colProgress } = colDeckYs[c];

        // Staggered start per column for color resolving into cream
        const colResolveStart = 0.25 + (((c * 7) % cols) / cols) * 0.35;
        const colResolveDuration = 0.35;

        const targetBlocksCount = config.heightInBlocks;
        const currentBlocksCount = Math.floor(colProgress * (targetBlocksCount + 1));

        for (let b = 0; b < currentBlocksCount; b++) {
          const y = colDeckY - (b + 1) * blockSize;
          if (y + blockSize < 0 || y >= ph) continue;

          const blockDelay = (b / 7) * 0.08;
          const blockResolveRatio = Math.max(0, Math.min(1, (currentProgress - (colResolveStart + blockDelay)) / colResolveDuration));

          let origColor = config.colors[b % config.colors.length];

          // Check if cursor is hovering over this block
          const isHovered = (
            boundaryMouseX >= x && boundaryMouseX < x + blockSize &&
            boundaryMouseY >= y && boundaryMouseY < y + blockSize
          );

          if (isHovered && blockResolveRatio < 0.65) {
            origColor = '#4ade80'; // Vivid lime hover reaction
          }

          // Smoothly interpolate block color into cream (#faf6ee)
          const blockColor = blockResolveRatio > 0 ? lerpColor(origColor, '#faf6ee', blockResolveRatio) : origColor;

          pctx.fillStyle = blockColor;
          pctx.fillRect(x - 0.5, y - 0.5, blockSize + 1, blockSize + 1);

          // 1px block outline: smoothly fades to 0 opacity as blocks resolve into cream
          const borderAlpha = (1 - blockResolveRatio) * (origColor === '#090c0a' ? 0.09 : 0.16);
          if (borderAlpha > 0.01) {
            pctx.strokeStyle = origColor === '#090c0a' ? ('rgba(255, 255, 255, ' + borderAlpha + ')') : ('rgba(15, 23, 42, ' + borderAlpha + ')');
            pctx.lineWidth = 1;
            pctx.strokeRect(x, y, blockSize, blockSize);
          }
        }
      }

      requestAnimationFrame(renderPixelWave);
    }
    requestAnimationFrame(renderPixelWave);
  }


  // =========================================================================
  // 12c. Arcade Page Frosted Glass & Illuminated Grid Squares Engine
  // =========================================================================
  const arcadeGridCanvas = document.getElementById('arcadeGridCanvas');
  if (arcadeGridCanvas) {
    const actx = arcadeGridCanvas.getContext('2d');
    let aw = 0;
    let ah = 0;
    let adpr = window.devicePixelRatio || 1;
    let targetX = -1000;
    let targetY = -1000;
    let curX = -1000;
    let curY = -1000;
    let isMouseInside = false;

    const gridSize = 46; // Crisp square cell size matching arcade theme
    let cols = 0;
    let rows = 0;
    let cellIntensities = [];
    let cellColors = [];

    const arcadePalette = [
      '#22c55e', // Neon Arcade Green
      '#38bdf8', // Cyber Cyan
      '#f43f5e', // Neon Rose
      '#facc15', // Pac-Man Gold
      '#a855f7', // Synthwave Violet
      '#ec4899'  // Neon Pink
    ];

    function resizeArcadeGrid() {
      adpr = window.devicePixelRatio || 1;
      aw = window.innerWidth;
      ah = window.innerHeight;
      arcadeGridCanvas.width = aw * adpr;
      arcadeGridCanvas.height = ah * adpr;
      actx.scale(adpr, adpr);

      cols = Math.ceil(aw / gridSize);
      rows = Math.ceil(ah / gridSize);

      cellIntensities = [];
      cellColors = [];
      for (let c = 0; c < cols; c++) {
        cellIntensities[c] = [];
        cellColors[c] = [];
        for (let r = 0; r < rows; r++) {
          cellIntensities[c][r] = 0;
          const hash = (c * 43 + r * 67 + (c ^ r) * 19) % arcadePalette.length;
          cellColors[c][r] = arcadePalette[hash];
        }
      }
    }

    window.addEventListener('resize', resizeArcadeGrid);
    resizeArcadeGrid();

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isMouseInside) {
        curX = targetX;
        curY = targetY;
        isMouseInside = true;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      isMouseInside = false;
    });

    let arcadeTime = 0;
    function renderArcadeGrid() {
      arcadeTime += 0.02;

      if (isMouseInside) {
        curX += (targetX - curX) * 0.09;
        curY += (targetY - curY) * 0.09;
      } else {
        // Ambient retro cruise path when idle
        curX = aw * 0.50 + Math.sin(arcadeTime * 0.55) * (aw * 0.32);
        curY = ah * 0.46 + Math.cos(arcadeTime * 0.40) * (ah * 0.25);
      }

      actx.clearRect(0, 0, aw, ah);

      // 1. Base grid lines
      actx.strokeStyle = 'rgba(34, 197, 94, 0.04)';
      actx.lineWidth = 1;
      actx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = c * gridSize;
        actx.moveTo(x, 0);
        actx.lineTo(x, ah);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * gridSize;
        actx.moveTo(0, y);
        actx.lineTo(aw, y);
      }
      actx.stroke();

      // 2. Light up squares around moving light source
      const radius = 290;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const sqCenterX = c * gridSize + gridSize / 2;
          const sqCenterY = r * gridSize + gridSize / 2;
          const dist = Math.hypot(sqCenterX - curX, sqCenterY - curY);

          let targetInt = 0;
          if (dist < radius) {
            targetInt = Math.pow(Math.max(0, 1 - dist / radius), 1.5);
          }

          if (targetInt > cellIntensities[c][r]) {
            cellIntensities[c][r] = targetInt;
          } else {
            cellIntensities[c][r] *= 0.93; // Smooth decaying trail of lit squares
          }

          const currentInt = cellIntensities[c][r];
          if (currentInt > 0.015) {
            const colorHex = cellColors[c][r];
            const x = c * gridSize;
            const y = r * gridSize;

            actx.fillStyle = colorHex;
            actx.globalAlpha = Math.min(0.85, currentInt * 0.95);
            actx.fillRect(x + 1.5, y + 1.5, gridSize - 3, gridSize - 3);

            // Glowing neon borders for active square tiles
            actx.strokeStyle = '#ffffff';
            actx.globalAlpha = Math.min(0.65, currentInt * 0.75);
            actx.lineWidth = 1.2;
            actx.strokeRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
          }
        }
      }
      actx.globalAlpha = 1.0;

      // 3. Arcade Moving Glowing Square Core behind frosted glass
      const sqSize = gridSize - 4; // Crisp square tile matching arcade grid (42px)
      const halfSq = sqSize / 2;

      // A. Layered geometric square aura radiating outward
      const auraSteps = [
        { scale: 3.4, alpha: 0.12, color: '#22c55e' },
        { scale: 2.3, alpha: 0.22, color: '#38bdf8' },
        { scale: 1.5, alpha: 0.35, color: '#facc15' }
      ];
      auraSteps.forEach((step) => {
        const aSize = sqSize * step.scale;
        actx.save();
        actx.fillStyle = step.color;
        actx.globalAlpha = step.alpha;
        actx.shadowColor = step.color;
        actx.shadowBlur = 32;
        actx.fillRect(curX - aSize / 2, curY - aSize / 2, aSize, aSize);
        actx.restore();
      });

      // B. Primary arcade moving glowing square tile
      actx.save();
      actx.globalAlpha = 0.95;
      actx.fillStyle = '#22c55e'; // Arcade green
      actx.shadowColor = '#22c55e';
      actx.shadowBlur = 24;
      actx.fillRect(curX - halfSq, curY - halfSq, sqSize, sqSize);

      // C. Luminous inner square frame
      actx.fillStyle = '#ffffff';
      actx.globalAlpha = 0.88;
      actx.fillRect(curX - halfSq + 4, curY - halfSq + 4, sqSize - 8, sqSize - 8);

      // D. Inner cyber core
      actx.fillStyle = '#38bdf8'; // Cyber cyan
      actx.globalAlpha = 0.95;
      actx.fillRect(curX - halfSq + 8, curY - halfSq + 8, sqSize - 16, sqSize - 16);

      // E. Crisp high-contrast white border
      actx.strokeStyle = '#ffffff';
      actx.lineWidth = 1.5;
      actx.globalAlpha = 1.0;
      actx.strokeRect(curX - halfSq, curY - halfSq, sqSize, sqSize);
      actx.restore();

      requestAnimationFrame(renderArcadeGrid);
    }
    requestAnimationFrame(renderArcadeGrid);
  }

  // =========================================================================
  // 13. Interactive Terminal / 3D Tilt Card Engine
  // =========================================================================
  const tiltCard = document.querySelector('.terminal-card');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 8;
      const rotY = (x / (rect.width / 2)) * 10;

      tiltCard.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 12. Curated Collectible Poster Gallery Engine (library.html)
  const posterGrid = document.querySelector('#poster-grid');
  if (posterGrid) {
    const titleImageMap = {
      // Manga & Anime
      'My Hero Academia': 'myhero.jpeg',
      'My Hero Academia (All Seasons)': 'myhero.jpeg',
      'JoJo’s Bizarre Adventure': 'jojo.jpeg',
      'JoJo’s Bizarre Adventure (All Parts and Seasons)': 'jojo.jpeg',
      'Attack on Titan': 'aot.jpeg',
      'Hunter × Hunter': 'hunterxhunter.jpeg',
      'Chainsaw Man': 'chiansaw man.webp',
      'Jujutsu Kaisen': 'jjk.jpeg',
      'One Punch Man': 'one_punch_man.jpg',
      'Fullmetal Alchemist': 'fullmetal_alchemist.jpg',
      'Fullmetal Alchemist: Brotherhood': 'fullmetal_alchemist.jpg',
      'Mob Psycho 100': 'mob_psycho.jpg',
      'Spy × Family': 'spyxfamily.jpeg',
      'Mashle: Magic and Muscles': 'mashle_magic.jpeg',
      'Fire Force': 'fire_force.jpg',
      'Kaiju No. 8': 'kaiju_no_8.jpeg',
      'Black Clover': 'black_clover.webp',
      'Tokyo Revengers': 'tokyo_reverngers.jpeg',
      'Demon Slayer: Kimetsu no Yaiba': 'demon_slyer.webp',
      'Frieren: Beyond Journey’s End': 'freiren_journey_beyound.jpeg',
      'Re:Zero − Starting Life in Another World': 'rezer0.jpeg',
      'That Time I Got Reincarnated as a Slime': 'the_time_i_got_reincarnated_as_slime.jpeg',
      'Overlord': 'overlord.jpeg',
      'The Eminence in Shadow': 'eminence_of_shadow.webp',
      'The Misfit of Demon King Academy': 'misfit_of_the_demon_academy.jpeg',
      'Sword Art Online': 'sword_Art_online.jpeg',
      'Hellsing': 'hellsing.jpeg',
      'Hellsing Ultimate': 'hellsing.jpeg',
      'Parasyte: The Maxim': 'parasyte.webp',
      'Dr. Stone': 'dr_stone.webp',
      'The Seven Deadly Sins': '7_deadly_sing.jpeg',
      'Blue Lock': 'blue_lock.webp',
      'Haikyuu!!': 'haikyuu.webp',
      'Classroom of the Elite': 'classroom_of_elite.jpeg',

      // Manhwa
      'Solo Leveling': 'solo_levelling.jpg',
      'Omniscient Reader’s Viewpoint': 'omniscient_reader.jpg',
      'Tower of God': 'tower_of_god.webp',
      'The Beginning After the End': 'beginning_after_the_end.jpeg',
      'Lookism': 'lookism.jpeg',
      'The God of High School': 'god_of_high_school.jpeg',
      'Eleceed': 'elceed.jpeg',
      'The Greatest Estate Developer': 'greatest_estate_developer.jpeg',
      'Nano Machine': 'nano_machine.jpeg',
      'The Legend of the Northern Blade': 'legend_of_northen_blade.jpg',
      'Return of the Mount Hua Sect': 'return_mount_hua_sect.jpeg',
      'The World After the Fall': 'worrld_after_we_fall.jpeg',
      'Doom Breaker': 'doom_breaker.jpeg',
      'SSS-Class Revival Hunter': 'sss_class_revival_hunter.jpeg',
      'Leviathan': 'Leviathan_cover.webp',
      'Hardcore Leveling Warrior': 'hardcore_levelling_warrior.jpeg',
      'Noblesse': 'nobellese.jpeg',
      'Weak Hero': 'weak_hero.jpeg'
    };

    // Pre-populated Reddit community consensus reviews for all 51 titles
    const communityReviews = {
      'Attack on Titan': 'Peak storytelling and jaw-dropping plot twists for 90% of the run, even if the ending divided the fanbase. An absolute masterclass in tension.',
      'Chainsaw Man': 'Pure unhinged chaos with cinematic framing and gut-punch emotional beats that completely reject typical shonen tropes. Messy, weird, and impossible to put down.',
      'Jujutsu Kaisen': 'The fight choreography and hype aura are genuinely unmatched. Post-Shibuya turns into an endless boss rush, but it remains an absolute visual spectacle.',
      'Hunter × Hunter': 'Boasts the most intricate magic system in manga and refuses to rely on cheap cliches. The Yorknew and Chimera Ant arcs are masterclasses in moral ambiguity.',
      'My Hero Academia': 'Started strong with genuine heart, great villains, and peak All Might moments. A solid modern superhero epic despite the final war arc pacing.',
      'My Hero Academia (All Seasons)': 'Started strong with genuine heart, great villains, and peak All Might moments. A solid modern superhero epic despite the final war arc pacing.',
      'JoJo’s Bizarre Adventure': 'An eccentric, stylish fever dream that stays fresh by completely reinventing cast and setting every part. Tactical Stand battles and pure flamboyance.',
      'JoJo’s Bizarre Adventure (All Parts and Seasons)': 'An eccentric, stylish fever dream that stays fresh by completely reinventing cast and setting every part. Tactical Stand battles and pure flamboyance.',
      'One Punch Man': 'Murata’s godly manga art makes every spread look like a museum centerpiece. Hilarious deconstruction of superhero tropes backed by clean action.',
      'Fullmetal Alchemist': 'The gold standard benchmark for what a complete, airtight story should be. Zero wasted scenes, incredible ensemble characters, and an ending that lands.',
      'Fullmetal Alchemist: Brotherhood': 'The gold standard benchmark for what a complete, airtight anime should be. Zero wasted scenes, incredible ensemble characters, and a flawless landing.',
      'Mob Psycho 100': 'One of the rare shows where every season gets progressively better, culminating in an emotionally perfect finale. More heart and creative animation than almost anything else.',
      'Spy × Family': 'The ultimate cozy comfort watch that balances hilarious slice-of-life comedy with slick undercover action. Anya’s meme-tier facial expressions carry the show.',
      'Mashle: Magic and Muscles': 'Harry Potter meets One Punch Man with cream puffs. Unapologetic parody that never takes itself too seriously and delivers punchy slapstick.',
      'Fire Force': 'Atsushi Ohkubo’s sound design in the anime hits with thunderous bass drops, and the animation during infernal fights is blazing eye candy.',
      'Kaiju No. 8': 'Having an underdog 32-year-old protagonist cleaning up monster guts is a delightfully refreshing spin on shonen. Comedic timing and hefty kaiju brawls.',
      'Black Clover': 'Asta’s yelling takes a minute to get used to, but the ensemble Black Bulls family dynamic and rapid-fire team magic battles become genuinely addictive.',
      'Tokyo Revengers': 'Time-leaping biker delinquency with huge emotional stakes and memorable rivalries, even when Takemichi gets beaten to a pulp every three chapters.',
      'Demon Slayer: Kimetsu no Yaiba': 'ufotable’s jaw-dropping animation carries what is fundamentally a classic shonen revenge story. Boss fight visual spectacles win you over completely.',
      'Frieren: Beyond Journey’s End': 'A meditative, breathtakingly beautiful exploration of time, grief, and human connection that happens after the hero’s quest ends. Pure modern masterpiece.',
      'Re:Zero − Starting Life in Another World': 'Psychological suffering and high-stakes mystery elevated by Subaru’s deeply flawed, human character arc and terrifying checkpoint mechanics.',
      'That Time I Got Reincarnated as a Slime': 'The peak comfort kingdom-building isekai where Rimuru absorbs everything and builds a peaceful monster utopia with great diplomatic world-building.',
      'Overlord': 'A dark power fantasy that thrives because the protagonist is genuinely the terrifying final boss from an outsider perspective. Tactical world-building.',
      'The Eminence in Shadow': 'Absolute comedic perfection where the protagonist is living out his chuunibyou fantasies while everyone around him fights actual deadly conspiracies.',
      'The Misfit of Demon King Academy': 'Anos Voldigoad is so comically overpowered that he stops time by blinking. Zero stakes, maximum glorious disrespect to arrogant snobs.',
      'Sword Art Online': 'The series everyone loves to clown on, yet it single-handedly paved the way for the modern isekai wave. The initial Aincrad death game remains iconic.',
      'Hellsing': 'Unhinged vampire violence, stylish crimson trenchcoats, and Alucard releasing Level 0 restriction with pure gothic swagger.',
      'Hellsing Ultimate': 'Unhinged vampire violence, stylish crimson trenchcoats, and Alucard releasing Level 0 restriction with pure gothic swagger.',
      'Parasyte: The Maxim': 'A tight, self-contained 24-episode thriller that executes body horror and existential questions with zero filler. Shinichi and Migi’s evolution is top-tier.',
      'Dr. Stone': 'Makes scientific chemistry and primitive engineering feel as hype as Dragon Ball beam clashes. Senku’s ten-billion-percent optimism is infectious.',
      'The Seven Deadly Sins': 'Early seasons delivered fantastic fantasy adventure and Escanor’s peak arrogance, even if late-season animation budget took a legendary nosedive.',
      'Blue Lock': 'Absolute sports shonen insanity where teamwork is treated as a weakness and narcissistic egoism is the only way forward. Unapologetically hype.',
      'Haikyuu!!': 'The peak of modern sports anime that somehow makes high school volleyball feel more intense than a world-ending shonen war. Flawless rally pacing.',
      'Classroom of the Elite': 'Ayanokouji’s ice-cold internal monologues and puppet-master psychological manipulation make high school exam point games feel like high-stakes espionage.',

      // Manhwa
      'Solo Leveling': 'The ultimate dopamine-fueled power fantasy where the late DUBU’s art goes astronomically hard. Turn your brain off and enjoy pure shadow monarch dominance.',
      'Omniscient Reader’s Viewpoint': 'Hands down one of the smartest manhwa out there, weaving meta-fiction, novel tropes, and apocalyptic constellation lore together seamlessly. Peak dynamic.',
      'Tower of God': 'Phenomenal world-building and intricate lore that rightfully earned it the title of the ‘One Piece of Manhwa’ early on. The floor tests remain iconic.',
      'The Beginning After the End': 'Starts off looking like a standard isekai clone, but gradually matures into a genuinely dark and high-stakes war epic with earned progression.',
      'Lookism': 'Started out as poignant social commentary on pretty privilege before mutating into an absurd, superhuman gang turf war with addictive choreography.',
      'The God of High School': 'Insane martial arts choreography and mythical power escalations with kinetic, fluid webtoon paneling that never stops moving.',
      'Eleceed': 'A delightfully wholesome blend of chunky cat comedy and electrifying supernatural beatdowns. Kayden and Jiwoo’s dynamic is pure comfort food.',
      'The Greatest Estate Developer': 'Lloyd Frontera’s horrifyingly expressive demonic gremlin faces and civil engineering schemes make this one of the funniest manhwa in existence.',
      'Nano Machine': 'A ruthless Murim revenge fantasy where sci-fi nanobots turn the MC into an unstoppable powerhouse. Watching him dismantle arrogant martial masters is gold.',
      'The Legend of the Northern Blade': 'The undisputed pinnacle of modern Murim manhwa, featuring heavy, stylized ink art and fight scenes with real physical weight and stoic honor.',
      'Return of the Mount Hua Sect': 'Chung Myung is an absolute feral menace whose chaotic greed and shameless arrogance make rebuilding his fallen clan wildly entertaining.',
      'The World After the Fall': 'Mind-bending cosmic mystery from the creators of ORV, featuring an MC who refused to leave the tutorial tower and thrusts through dimensional illusions.',
      'Doom Breaker': 'One of the best-drawn regression action manhwa out there, with relentless dragon disciple combat and tactical preparations against corrupt gods.',
      'SSS-Class Revival Hunter': 'What looks like a generic hunter regression manhwa evolves into a deeply philosophical, emotional journey about empathizing with your opponents.',
      'Leviathan': 'An underrated, waterlogged post-apocalyptic thriller with jaw-dropping sea monster art and visceral survival action that actually sticks its landing.',
      'Hardcore Leveling Warrior': 'A wild, imaginative VR MMO world with betting mechanics, gambling luck powers, and surprising emotional depth in its later arcs.',
      'Noblesse': 'Cadis Etrama Di Raizel bringing aristocratic elegance, ramen adoration, and blood-red destruction to modern supernatural conspiracies.',
      'Weak Hero': 'Gray Yeon using physics, calculated environmental awareness, and psychological cruelty to systematically dismantle school bullies.',

      // Books
      'Atomic Habits — James Clear': 'The clearest, most pragmatic manual on small incremental compound improvements. Mandatory reading for systems thinkers.',
      'The 7 Habits of Highly Effective People — Stephen R. Covey': 'Timeless principle-centered paradigm on character ethics, proactive initiative, and empathic listening.',
      'Deep Work — Cal Newport': 'A relentless argument against distraction and shallow context switching in an age of automated cognitive work.',
      'Reverend Insanity': 'Fang Yuan is the most uncompromising, utilitarian protagonist in cultivation fiction. Intense faction chess matches and immortal scheming.'
    };

    const collections = {
      manga: [
        'My Hero Academia', 'JoJo’s Bizarre Adventure', 'Attack on Titan', 'Hunter × Hunter',
        'Chainsaw Man', 'Jujutsu Kaisen', 'One Punch Man', 'Fullmetal Alchemist',
        'Fullmetal Alchemist: Brotherhood', 'Mob Psycho 100', 'Spy × Family', 'Mashle: Magic and Muscles',
        'Fire Force', 'Kaiju No. 8', 'Black Clover', 'Tokyo Revengers',
        'Demon Slayer: Kimetsu no Yaiba', 'Frieren: Beyond Journey’s End', 'Re:Zero − Starting Life in Another World',
        'That Time I Got Reincarnated as a Slime', 'Overlord', 'The Eminence in Shadow',
        'The Misfit of Demon King Academy', 'Sword Art Online'
      ],
      manhwa: [
        'Solo Leveling', 'Omniscient Reader’s Viewpoint', 'Tower of God', 'The Beginning After the End',
        'Lookism', 'The God of High School', 'Eleceed', 'The Greatest Estate Developer',
        'Nano Machine', 'The Legend of the Northern Blade', 'Return of the Mount Hua Sect',
        'The World After the Fall', 'Doom Breaker', 'SSS-Class Revival Hunter',
        'Leviathan', 'Hardcore Leveling Warrior', 'Noblesse', 'Weak Hero'
      ],
      anime: [
        'My Hero Academia (All Seasons)', 'JoJo’s Bizarre Adventure (All Parts and Seasons)',
        'Attack on Titan', 'Hunter × Hunter', 'Chainsaw Man', 'Jujutsu Kaisen', 'One Punch Man',
        'Fullmetal Alchemist: Brotherhood', 'Fullmetal Alchemist', 'Mob Psycho 100', 'Spy × Family',
        'Mashle: Magic and Muscles', 'Fire Force', 'Kaiju No. 8', 'Black Clover', 'Tokyo Revengers',
        'Demon Slayer: Kimetsu no Yaiba', 'Hellsing', 'Hellsing Ultimate', 'Parasyte: The Maxim',
        'Dr. Stone', 'The Seven Deadly Sins', 'Blue Lock', 'Haikyuu!!', 'Classroom of the Elite',
        'Frieren: Beyond Journey’s End', 'Re:Zero − Starting Life in Another World',
        'That Time I Got Reincarnated as a Slime', 'Overlord', 'The Eminence in Shadow',
        'The Misfit of Demon King Academy', 'Sword Art Online', 'Solo Leveling'
      ],
      books: [
        'Atomic Habits — James Clear',
        'The 7 Habits of Highly Effective People — Stephen R. Covey',
        'Deep Work — Cal Newport',
        'Reverend Insanity'
      ]
    };

    const params = new URLSearchParams(window.location.search);
    let activeType = params.get('type') || 'all';

    const searchInput = document.querySelector('#shelf-search');
    const filterTabs = document.querySelectorAll('.shelf-filter-btn');
    const countDisplay = document.querySelector('#shelf-count');
    const shelfTitle = document.querySelector('#shelf-title');
    const shelfDesc = document.querySelector('#shelf-description');

    const descriptions = {
      all: 'Every volume, chapter, and story collected in Aditya’s physical & digital sanctuary.',
      manga: 'Hand-drawn ink panels, Shonen epics, and intricate storylines from Japan.',
      manhwa: 'Vibrant vertical webtoons, dungeon ascents, and martial arts cultivation.',
      anime: 'Masterpieces in motion, legendary soundtracks, and animated world-building.',
      books: 'Deep work frameworks, systemic habits, and philosophy worth holding onto.'
    };

    function updateTitle(type) {
      if (shelfTitle) {
        shelfTitle.textContent = type === 'all' ? 'The Complete Shelf' : `${type.toUpperCase()} COLLECTION`;
      }
      if (shelfDesc) {
        shelfDesc.textContent = descriptions[type] || descriptions.all;
      }
    }

    function renderCards() {
      const query = (searchInput?.value || '').trim().toLowerCase();
      let items = [];

      if (activeType === 'all') {
        Object.keys(collections).forEach((cat) => {
          collections[cat].forEach((name) => {
            items.push({ name, type: cat });
          });
        });
      } else if (collections[activeType]) {
        items = collections[activeType].map((name) => ({ name, type: activeType }));
      }

      const filtered = items.filter((it) => {
        const titleMatch = it.name.toLowerCase().includes(query);
        const reviewText = (communityReviews[it.name] || '').toLowerCase();
        const reviewMatch = reviewText.includes(query);
        return titleMatch || reviewMatch;
      });

      if (countDisplay) {
        countDisplay.textContent = `★ Displaying ${filtered.length} of ${items.length} titles`;
      }

      function getColumnCount() {
        const width = window.innerWidth;
        if (width >= 1320) return 5;
        if (width >= 1040) return 4;
        if (width >= 720) return 3;
        if (width >= 480) return 2;
        return 1;
      }

      if (filtered.length === 0) {
        posterGrid.innerHTML = `
          <div style="width: 100%; text-align: center; padding: 60px 0;">
            <p style="font-family: var(--font-display); font-size: 1.6rem; margin-bottom: 8px;">No titles found matching "${escapeHtml(query)}"</p>
            <p style="font-family: var(--font-mono); color: var(--ink-muted);">Try searching another title or select a different category tab.</p>
          </div>
        `;
        return;
      }

      const colCount = getColumnCount();
      const colCards = Array.from({ length: colCount }, () => []);

      filtered.forEach((item, index) => {
        const colIndex = index % colCount;
        const imageFile = titleImageMap[item.name];
        const imagePath = imageFile ? `./assets/images/${encodeURIComponent(imageFile)}` : null;
        const review = communityReviews[item.name] || 'Community favorite with high acclaim across discussions.';

        const coverMarkup = imagePath
          ? `<img class="collectible-img" src="${imagePath}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;height:100%;align-items:center;justify-content:center;font-size:3rem;\\'>📚</div>'">`
          : `<div style="display:flex;height:100%;align-items:center;justify-content:center;font-size:3rem;background:var(--lemon);">📖</div>`;

        const cardHtml = `
          <article class="collectible-card tilt-card" data-index="${index}" tabindex="0" role="button" aria-label="${escapeHtml(item.name)} — click to expand take">
            <div class="collectible-img-frame">
              ${coverMarkup}
              <span class="collectible-badge">${escapeHtml(item.type)}</span>
            </div>
            <div class="collectible-meta">
              <span class="collectible-number">NO. ${String(index + 1).padStart(2, '0')}</span>
              <h3 class="collectible-title" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h3>
              
              <button type="button" class="review-toggle-btn" aria-expanded="false" data-card-idx="${index}">
                <span>💭</span> <span>Community Take</span>
              </button>

              <div class="collectible-review-tray" id="review-tray-${index}">
                <span class="review-source-tag">r/anime &amp; r/manga</span>
                <p class="review-content">"${escapeHtml(review)}"</p>
                <div class="review-author-note">✎ Aditya’s personal take coming soon</div>
              </div>
            </div>
          </article>
        `;
        colCards[colIndex].push(cardHtml);
      });

      posterGrid.innerHTML = colCards
        .filter((col) => col.length > 0)
        .map((col) => `<div class="poster-grid-col">${col.join('')}</div>`)
        .join('');

      // Wire up card click to expand review (clicking anywhere on the tile)
      posterGrid.querySelectorAll('.collectible-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;

          const tray = card.querySelector('.collectible-review-tray');
          const btn = card.querySelector('.review-toggle-btn');
          if (tray) {
            const isExpanded = tray.classList.toggle('expanded');
            card.classList.toggle('card-expanded', isExpanded);
            if (btn) {
              btn.setAttribute('aria-expanded', String(isExpanded));
              btn.innerHTML = isExpanded 
                ? '<span>✕</span> <span>Close Take</span>' 
                : '<span>💭</span> <span>Community Take</span>';
            }
          }
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      });

      // Re-attach 3D tilt physics to new cards
      attachTiltPhysics(posterGrid.querySelectorAll('.collectible-card'));
    }

    // Responsive re-columnizing on window resize
    let prevColCount = window.innerWidth >= 980 ? 4 : (window.innerWidth >= 720 ? 3 : (window.innerWidth >= 480 ? 2 : 1));
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const curColCount = w >= 980 ? 4 : (w >= 720 ? 3 : (w >= 480 ? 2 : 1));
      if (curColCount !== prevColCount) {
        prevColCount = curColCount;
        renderCards();
      }
    });

    function updateFlankStickers(type) {
      const left = document.getElementById('shelfFlankLeft');
      const right = document.getElementById('shelfFlankRight');
      if (!left || !right) return;
      // Show side floating stickers strictly for manga, manhwa, anime (and all)
      // Hide them for books to avoid clashing
      const show = (type === 'manga' || type === 'manhwa' || type === 'anime' || type === 'all');
      left.classList.toggle('flank-hidden', !show);
      right.classList.toggle('flank-hidden', !show);
    }

    filterTabs.forEach((tab) => {
      if (tab.getAttribute('data-type') === activeType) {
        tab.classList.add('active');
      }
      tab.addEventListener('click', () => {
        filterTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        activeType = tab.getAttribute('data-type') || 'all';
        updateTitle(activeType);
        updateFlankStickers(activeType);
        renderCards();
      });
    });

    searchInput?.addEventListener('input', renderCards);

    updateTitle(activeType);
    updateFlankStickers(activeType);
    renderCards();
  }

  // =========================================================================
  // 14. Dynamic Manga / Anime ASCII Art Backdrop Engine (library.html & archive.html)
  // =========================================================================
  const asciiCanvas = document.getElementById('animeAsciiCanvas');
  if (asciiCanvas) {
    const actx = asciiCanvas.getContext('2d');
    let aw = 0;
    let ah = 0;
    let dpr = window.devicePixelRatio || 1;
    let scrollY = window.scrollY || 0;
    let mouseX = -1000;
    let mouseY = -1000;

    const glyphs = [
      'ドドド', 'ゴゴゴ', 'ズズズ', 'バッ', 'ッ', 'ガッ', '⚡', '✦', '★', '✶',
      '01', '99+', 'SHONEN', 'MANGA', 'INK', '//VOL', '>>ACT', 'SANCTUARY',
      '◈', '▣', '::', '///', '「', '」', '≡', '~', '+', '=', '#', '░▒▓'
    ];

    const charSpacingX = 46;
    const charSpacingY = 32;
    let charCols = 0;
    let charRows = 0;

    function resizeAscii() {
      dpr = window.devicePixelRatio || 1;
      aw = window.innerWidth;
      ah = window.innerHeight;
      asciiCanvas.width = aw * dpr;
      asciiCanvas.height = ah * dpr;
      actx.scale(dpr, dpr);
      charCols = Math.ceil(aw / charSpacingX) + 1;
      charRows = Math.ceil(ah / charSpacingY) + 2;
    }

    window.addEventListener('resize', resizeAscii);
    resizeAscii();

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY || 0;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    let time = 0;
    function renderAscii() {
      time += 0.02;
      actx.clearRect(0, 0, aw, ah);

      actx.font = '600 12px "Space Mono", monospace, Courier';
      actx.textAlign = 'center';
      actx.textBaseline = 'middle';

      const scrollOffset = (scrollY * 0.18) % charSpacingY;

      for (let c = 0; c < charCols; c++) {
        for (let r = 0; r < charRows; r++) {
          const x = c * charSpacingX;
          const y = r * charSpacingY - scrollOffset;

          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const glyphIdx = Math.abs(Math.floor((c * 19 + r * 31 + Math.floor(scrollY * 0.04)) % glyphs.length));
          const char = glyphs[glyphIdx];

          // Clearly visible breathing alpha pulse (0.14 to 0.28 — warm tactile ink)
          const breath = Math.sin(time * 1.8 + c * 0.22 + r * 0.16) * 0.5 + 0.5;
          let alpha = 0.14 + breath * 0.14;
          let color = `rgba(55, 45, 36, ${alpha.toFixed(3)})`;

          if (dist < 160) {
            const boost = (1 - dist / 160);
            alpha = 0.28 + boost * 0.45;
            color = `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
          }

          actx.fillStyle = color;
          actx.fillText(char, x, y);
        }
      }

      requestAnimationFrame(renderAscii);
    }
    requestAnimationFrame(renderAscii);
  }
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}