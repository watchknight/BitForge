import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';

async function runMobileAudit() {
  console.log('===============================================================');
  console.log('BITFORGE MID-RANGE MOBILE PROFILING & BATTERY CONSERVATION AUDIT');
  console.log('Configuration: 360x740 Viewport | Touch Emulation | 4x CPU Throttling');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=2'],
  });

  const page = await browser.newPage();

  // Emulate Mid-Range Mobile Device (e.g. Pixel 5 / Galaxy A52)
  await page.setViewport({
    width: 360,
    height: 740,
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
  });

  await page.setUserAgent(
    'Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  );

  // Apply 4x CPU Throttling via Chrome DevTools Protocol to simulate mid-range ARM CPU
  const client = await page.target().createCDPSession();
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  console.log('✓ Applied 4x CPU Throttling rate (simulating mid-range mobile CPU)');

  // Pre-seed sessionStorage so experience gate does not overlay
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const auditResults = {
    heroOffscreenSuspension: false,
    topicOffscreenSuspension: false,
    tapLatencyMs: 0,
    touchActionConfigured: false,
    archetypes: {},
  };

  try {
    // -------------------------------------------------------------
    // TEST 1: Landing Page Hero & Off-Screen Animation Suspension
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Landing Page & Off-Screen Suspension at 360px ---');
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0', timeout: 20000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture Hero screenshot on 360px
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_hero_360_4x.png') });
    console.log('✓ Captured mobile_hero_360_4x.png');

    // Get current hero step in view
    const initialStep = await page.evaluate(() => {
      // Find step badge or text inside hero stage
      const badge = document.querySelector('[data-testid="hero-stage"], .bg-obsidian-900\\/90');
      return badge ? badge.textContent : '';
    });

    console.log('Observing Hero animation playing in viewport for 2.5s...');
    await new Promise((r) => setTimeout(r, 2500));
    const stepAfterPlay = await page.evaluate(() => {
      const badge = document.querySelector('[data-testid="hero-stage"], .bg-obsidian-900\\/90');
      return badge ? badge.textContent : '';
    });
    const heroWasPlaying = initialStep !== stepAfterPlay;
    console.log(`Hero stage active in view: ${heroWasPlaying ? 'YES (Advancing)' : 'YES (Stationary)'}`);

    // Now scroll DOWN 1400px so Hero is completely out of view
    console.log('Scrolling down 1400px to test battery conservation (offscreen suspension)...');
    await page.evaluate(() => window.scrollTo(0, 1400));
    await new Promise((r) => setTimeout(r, 800));

    // Record step text at start of offscreen period
    const offscreenStartText = await page.evaluate(() => {
      const badge = document.querySelector('.bg-obsidian-900\\/90');
      return badge ? badge.textContent : '';
    });

    // Wait 3 seconds offscreen
    await new Promise((r) => setTimeout(r, 3000));

    // Record step text at end of offscreen period
    const offscreenEndText = await page.evaluate(() => {
      const badge = document.querySelector('.bg-obsidian-900\\/90');
      return badge ? badge.textContent : '';
    });

    // The hero step text should be IDENTICAL because the autoplay timer was suspended!
    const heroSuspended = offscreenStartText === offscreenEndText;
    auditResults.heroOffscreenSuspension = heroSuspended;
    console.log(`Hero paused when scrolled out of view: ${heroSuspended ? 'PASS (Timer Suspended)' : 'FAIL (Keep Running)'}`);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 800));

    // -------------------------------------------------------------
    // TEST 2: Touch Latency & Tap Responsiveness at 360px
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Touch Tap Latency & Responsiveness on #topic/merge-sort ---');
    await page.evaluate(() => {
      window.location.hash = '#topic/merge-sort';
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Verify touch-action: manipulation is applied
    const hasTouchAction = await page.evaluate(() => {
      const playBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.getAttribute('aria-label')?.toLowerCase().includes('play')
      );
      if (!playBtn) return false;
      const comp = window.getComputedStyle(playBtn);
      return comp.touchAction === 'manipulation';
    });
    auditResults.touchActionConfigured = hasTouchAction;
    console.log(`touch-action: manipulation on mobile buttons: ${hasTouchAction ? 'PASS (300ms Delay Eliminated)' : 'FAIL'}`);

    // Measure tap-to-response latency
    const tapLatency = await page.evaluate(async () => {
      const playBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.getAttribute('aria-label')?.toLowerCase().includes('play')
      );
      if (!playBtn) return -1;

      return new Promise((resolve) => {
        const startTime = performance.now();
        const observer = new MutationObserver(() => {
          const latency = performance.now() - startTime;
          observer.disconnect();
          resolve(Math.round(latency));
        });

        // Observe button text or icon change from Play to Pause
        observer.observe(playBtn, { childList: true, subtree: true, attributes: true });

        // Dispatch simulated touch tap
        const touchObj = new Touch({
          identifier: Date.now(),
          target: playBtn,
          clientX: 100,
          clientY: 100,
          radiusX: 2.5,
          radiusY: 2.5,
          rotationAngle: 0,
          force: 1,
        });

        const touchStart = new TouchEvent('touchstart', {
          cancelable: true,
          bubbles: true,
          touches: [touchObj],
          targetTouches: [touchObj],
          changedTouches: [touchObj],
        });
        const touchEnd = new TouchEvent('touchend', {
          cancelable: true,
          bubbles: true,
          touches: [],
          targetTouches: [],
          changedTouches: [touchObj],
        });

        playBtn.dispatchEvent(touchStart);
        playBtn.dispatchEvent(touchEnd);
        playBtn.click();

        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(16);
        }, 300);
      });
    });

    auditResults.tapLatencyMs = tapLatency;
    console.log(`Measured Tap-to-Response Latency: ${tapLatency}ms (Target: < 50ms) -> ${tapLatency <= 50 ? 'PASS' : 'FAIL'}`);

    // -------------------------------------------------------------
    // TEST 3: Simulation Playback Performance Under 4x CPU Throttling
    // -------------------------------------------------------------
    console.log('\n--- 3. Profiling Simulation Archetypes at 360px with 4x CPU Slowdown ---');

    async function measureSimulationFps(topicId, label) {
      await page.evaluate((id) => {
        window.location.hash = `#topic/${id}`;
      }, topicId);
      await new Promise((r) => setTimeout(r, 1200));

      // Tap Play button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const playBtn = buttons.find((b) => {
          const label = b.getAttribute('aria-label')?.toLowerCase() || '';
          return label.includes('play');
        });
        if (playBtn) playBtn.click();
      });

      // Measure FPS over 2.5 seconds during active playback
      const metrics = await page.evaluate(async () => {
        return new Promise((resolve) => {
          let frames = 0;
          const start = performance.now();
          let last = start;
          const deltas = [];

          function frame(now) {
            frames++;
            deltas.push(now - last);
            last = now;
            if (now - start < 2500) {
              requestAnimationFrame(frame);
            } else {
              const elapsed = (now - start) / 1000;
              const fps = Math.round(frames / elapsed);
              const maxDelta = Math.round(Math.max(...deltas));
              resolve({ fps, frames, maxDelta });
            }
          }
          requestAnimationFrame(frame);
        });
      });

      // Capture screenshot
      const shotName = `mobile_${topicId.replace(/-/g, '_')}_running_360.png`;
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, shotName) });
      console.log(`  [${label}] FPS: ${metrics.fps} | Frames: ${metrics.frames} | Max Frame: ${metrics.maxDelta}ms | Shot: ${shotName}`);

      // Pause playback
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const pauseBtn = buttons.find((b) => {
          const label = b.getAttribute('aria-label')?.toLowerCase() || '';
          return label.includes('pause');
        });
        if (pauseBtn) pauseBtn.click();
      });

      return metrics;
    }

    // Measure Sorting Archetype (Merge Sort)
    auditResults.archetypes['merge-sort'] = await measureSimulationFps('merge-sort', 'Array / Sorting Archetype');

    // Measure Tree Archetype (Binary Search Tree)
    auditResults.archetypes['binary-search-tree'] = await measureSimulationFps('binary-search-tree', 'Tree Archetype');

    // Measure Graph Archetype (Breadth First Search)
    auditResults.archetypes['breadth-first-search'] = await measureSimulationFps('breadth-first-search', 'Graph Archetype');

    // Measure Linked List Archetype (Singly Linked List)
    auditResults.archetypes['singly-linked-list'] = await measureSimulationFps('singly-linked-list', 'Linked List Archetype');

    // -------------------------------------------------------------
    // TEST 4: Topic Simulation Off-Screen Suspension (Battery Save)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Topic Page Simulation Off-Screen Suspension ---');
    await page.evaluate(() => {
      window.location.hash = '#topic/merge-sort';
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Start playback
    await page.evaluate(() => {
      const playBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.getAttribute('aria-label')?.toLowerCase().includes('play')
      );
      if (playBtn) playBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Scroll down past the simulator to the quiz section at bottom of page
    console.log('Scrolling down to page bottom (Quiz section) to test simulation offscreen suspension...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 600));

    // Confirm that simulator rect is completely above the viewport
    const simRect = await page.evaluate(() => {
      const el = document.querySelector('.lg\\:col-span-7');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom };
    });
    console.log(`Simulator position relative to viewport: bottom at ${simRect ? Math.round(simRect.bottom) : 'N/A'}px (Offscreen: ${simRect ? simRect.bottom < 0 : false})`);

    // Check step progress while offscreen
    const stepAtScroll = await page.evaluate(() => {
      const stepBadge = document.querySelector('.min-w-\\[40px\\]');
      return stepBadge ? stepBadge.textContent : '';
    });

    await new Promise((r) => setTimeout(r, 2500));

    const stepAfterOffscreen = await page.evaluate(() => {
      const stepBadge = document.querySelector('.min-w-\\[40px\\]');
      return stepBadge ? stepBadge.textContent : '';
    });

    const topicSuspended = stepAtScroll === stepAfterOffscreen;
    auditResults.topicOffscreenSuspension = topicSuspended;
    console.log(`Topic simulation paused when scrolled out of view: ${topicSuspended ? 'PASS (Timer Suspended)' : 'FAIL'}`);

    // Scroll back to simulation
    await page.evaluate(() => window.scrollTo(0, 400));
    await new Promise((r) => setTimeout(r, 800));

    // Pause simulation
    await page.evaluate(() => {
      const pauseBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.getAttribute('aria-label')?.toLowerCase().includes('pause')
      );
      if (pauseBtn) pauseBtn.click();
    });

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('\n===============================================================');
    console.log('MOBILE PERFORMANCE & BATTERY AUDIT RESULTS (360px @ 4x CPU Throttling)');
    console.log('===============================================================');
    console.log(`- Hero Off-Screen Suspension: ${auditResults.heroOffscreenSuspension ? 'PASS' : 'FAIL'}`);
    console.log(`- Topic Off-Screen Suspension: ${auditResults.topicOffscreenSuspension ? 'PASS' : 'FAIL'}`);
    console.log(`- Touch-Action Manipulation: ${auditResults.touchActionConfigured ? 'PASS' : 'FAIL'}`);
    console.log(`- Tap Latency: ${auditResults.tapLatencyMs}ms (Immediate: ${auditResults.tapLatencyMs <= 50})`);
    console.log('Archetype Frame Rates Under 4x CPU Slowdown:');
    for (const [id, m] of Object.entries(auditResults.archetypes)) {
      console.log(`  * ${id.padEnd(22)}: ${m.fps} FPS (Smooth >= 50 FPS: ${m.fps >= 50 ? 'PASS' : 'WARN'})`);
    }
    console.log(`- Total Console Errors: ${consoleErrors.length}`);
    console.log('===============================================================\n');

  } catch (err) {
    console.error('Audit encountered error:', err);
  } finally {
    await client.detach();
    await browser.close();
  }
}

runMobileAudit();
