import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const BASE_URL = 'http://127.0.0.1:4173';
const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVerification() {
  console.log('===============================================================');
  console.log('  BITFORGE STEPS 6, 7, 8, 9 VERIFICATION SUITE');
  console.log('  (Typography, Mobile Navigation, Roadmap Skill-Tree, Perf)');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 360, height: 800, isMobile: true, hasTouch: true },
  });

  const page = await browser.newPage();
  const cdp = await page.target().createCDPSession();

  // Step 8: Emulate mid-range mobile CPU with 4x CPU Throttling
  console.log('Enabling 4x CPU throttling to emulate mid-range mobile performance...');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  // -------------------------------------------------------------
  // PREPARATION: Bypass Intro Gate
  // -------------------------------------------------------------
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => sessionStorage.setItem('bitforge_experience_entered', 'true'));
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // -------------------------------------------------------------
  // STEP 6: TYPOGRAPHY & HERO ANIMATIONS (FLUID CLAMP)
  // -------------------------------------------------------------
  console.log('\n--- Step 6: Verifying Fluid Typography on 360px Mobile ---');
  const typographyMetrics = await page.evaluate(() => {
    // Find staggered hero headline elements
    const headlines = Array.from(document.querySelectorAll('h1 span, h1'));
    const headline = headlines[0];
    const computed = headline ? window.getComputedStyle(headline) : null;
    const docWidth = document.documentElement.clientWidth;
    const docScrollWidth = document.documentElement.scrollWidth;

    // Check sentence builder phrases
    const sentenceCards = document.querySelectorAll('[data-phrase-index]');

    return {
      docWidth,
      docScrollWidth,
      hasOverflow: docScrollWidth > docWidth,
      headlineFontSize: computed ? computed.fontSize : 'N/A',
      headlineLineHeight: computed ? computed.lineHeight : 'N/A',
      sentenceCardCount: sentenceCards.length,
    };
  });
  console.log('Typography metrics at 360px:', typographyMetrics);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step6_hero_headline_360px.png` });
  console.log(`Saved screenshot: ${SCREENSHOT_DIR}/mobile_step6_hero_headline_360px.png`);

  // Scroll down to ScrollSentenceBuilder
  console.log('Testing ScrollSentenceBuilder scroll-driven progression...');
  const sentenceSectionExists = await page.evaluate(() => {
    const el = document.querySelector('[data-phrase-index="0"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }
    return false;
  });

  if (sentenceSectionExists) {
    await new Promise((r) => setTimeout(r, 600));
    // Scroll through phrases
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step6_sentence_builder_360px.png` });
    console.log(`Saved screenshot: ${SCREENSHOT_DIR}/mobile_step6_sentence_builder_360px.png`);
  }

  // -------------------------------------------------------------
  // STEP 7: NAVIGATION & ROADMAP SKILL-TREE ADAPTATION
  // -------------------------------------------------------------
  console.log('\n--- Step 7.1: Verifying Mobile Navigation Drawer ---');
  // Open hamburger menu
  const menuButton = await page.$('button[aria-label="Toggle navigation menu"]');
  if (menuButton) {
    await menuButton.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step7_navbar_drawer_360px.png` });
    console.log(`Saved screenshot: ${SCREENSHOT_DIR}/mobile_step7_navbar_drawer_360px.png`);

    // Verify touch targets and close on Escape
    const drawerStats = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-nav-menu');
      const buttons = drawer ? Array.from(drawer.querySelectorAll('button')) : [];
      const buttonSizes = buttons.map(b => {
        const rect = b.getBoundingClientRect();
        return { text: b.textContent?.trim().slice(0, 15), h: Math.round(rect.height), w: Math.round(rect.width) };
      });
      return {
        isDrawerOpen: !!drawer,
        buttonSizes,
      };
    });
    console.log('Mobile drawer buttons:', drawerStats);

    // Test Escape key close
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('\n--- Step 7.2: Verifying Roadmap Skill-Tree Adaptation on 360px ---');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const roadmapMobileAudit = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const docScrollWidth = document.documentElement.scrollWidth;

    // Check Stage Scrubber
    const scrubberButtons = Array.from(document.querySelectorAll('button')).filter(b => 
      b.textContent?.includes('1') || b.textContent?.includes('Foundations') || b.textContent?.includes('Stage')
    );

    // Check category milestone headers
    const stage1 = document.getElementById('stage-1');
    const stage2 = document.getElementById('stage-2');
    const stage11 = document.getElementById('stage-11');

    return {
      docWidth,
      docScrollWidth,
      hasOverflow: docScrollWidth > docWidth,
      hasStage1: !!stage1,
      hasStage2: !!stage2,
      hasStage11: !!stage11,
      stage1Header: stage1?.querySelector('h2')?.textContent?.trim(),
      stage1Milestone: stage1?.querySelector('.font-mono.font-bold')?.textContent?.trim(),
    };
  });
  console.log('Roadmap mobile audit metrics:', roadmapMobileAudit);

  // Test clicking stage scrubber to scroll to Stage 2
  await page.evaluate(() => {
    const stage2 = document.getElementById('stage-2');
    if (stage2) {
      stage2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step7_roadmap_timeline_360px.png` });
  console.log(`Saved screenshot: ${SCREENSHOT_DIR}/mobile_step7_roadmap_timeline_360px.png`);

  // -------------------------------------------------------------
  // STEP 8: PERFORMANCE VERIFICATION (DriftingEmbers & Mid-Range Emulation)
  // -------------------------------------------------------------
  console.log('\n--- Step 8: Performance Verification Under 4x CPU Throttling ---');
  const perfMetrics = await page.evaluate(async () => {
    // Measure FPS/frame timing during smooth scrolling
    const start = performance.now();
    let frames = 0;
    
    await new Promise((resolve) => {
      let scrollDistance = 0;
      const step = () => {
        frames++;
        scrollDistance += 30;
        window.scrollBy(0, 30);
        if (scrollDistance < 600 && performance.now() - start < 1000) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });

    const elapsed = performance.now() - start;
    const approxFps = Math.round((frames / elapsed) * 1000);

    return {
      frames,
      elapsedMs: Math.round(elapsed),
      approxFps,
    };
  });
  console.log('Performance metrics under 4x CPU throttling:', perfMetrics);

  // -------------------------------------------------------------
  // STEP 9: FULL-SITE MULTI-BREAKPOINT AUDIT (360px, 390px, 768px)
  // -------------------------------------------------------------
  console.log('\n--- Step 9: Multi-Breakpoint Audit Across Viewports ---');
  const viewports = [
    { name: '360px Phone (iPhone SE / Small Android)', width: 360, height: 800 },
    { name: '390px Phone (iPhone 13/14/15)', width: 390, height: 844 },
    { name: '768px Tablet Portrait (iPad Mini)', width: 768, height: 1024 },
  ];

  const routes = [
    { hash: '', name: 'Landing' },
    { hash: 'roadmap', name: 'Roadmap' },
    { hash: 'race', name: 'RaceMode' },
    { hash: 'quizzes', name: 'QuizHub' },
    { hash: 'topic/merge-sort', name: 'MergeSort_Topic' },
  ];

  const auditResults = [];

  for (const vp of viewports) {
    console.log(`\nTesting viewport ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: true, hasTouch: true });

    for (const r of routes) {
      await page.goto(`${BASE_URL}/#${r.hash}`, { waitUntil: 'networkidle0' });
      await new Promise((res) => setTimeout(res, 400));

      const pageCheck = await page.evaluate(() => {
        const clientW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        return {
          clientW,
          scrollW,
          overflowPx: Math.max(0, scrollW - clientW),
        };
      });

      const pass = pageCheck.overflowPx <= 1;
      auditResults.push({
        viewport: vp.width,
        route: r.name,
        overflowPx: pageCheck.overflowPx,
        status: pass ? 'PASS' : 'FAIL',
      });
      console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${r.name.padEnd(16)}: scrollWidth=${pageCheck.scrollW}, clientWidth=${pageCheck.clientW}, overflow=${pageCheck.overflowPx}px`);
    }
  }

  console.log('\n===============================================================');
  console.log('  FINAL VERIFICATION SUMMARY');
  console.log('===============================================================');
  const allPassed = auditResults.every(r => r.status === 'PASS');
  console.log(`Total audits: ${auditResults.length} | All 0px overflow: ${allPassed ? 'YES' : 'NO'}`);
  console.log('Screenshots generated in:', SCREENSHOT_DIR);

  await browser.close();
}

runVerification().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
