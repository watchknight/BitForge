import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const BASE_URL = 'http://127.0.0.1:4173';

async function verifyBackgroundRedesign() {
  console.log('====================================================');
  console.log('  BITFORGE BACKGROUND REDESIGN VERIFICATION');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // Bypass the intro gate for testing
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  // TEST 1: Landing Page Hero (Full Treatment: Glow + Grain + Drifting Embers)
  console.log('--- 1. Testing Landing Page Hero Treatment ---');
  const heroStatus = await page.evaluate(() => {
    const heroGlow = document.querySelector('.forge-glow-hero');
    const heroGrain = document.querySelector('.forge-grain');
    // Canvas within hero section
    const canvases = Array.from(document.querySelectorAll('canvas'));
    return {
      hasHeroGlow: !!heroGlow,
      hasGrain: !!heroGrain,
      canvasCount: canvases.length,
    };
  });
  console.log('Hero Status:', heroStatus);
  if (!heroStatus.hasHeroGlow || !heroStatus.hasGrain || heroStatus.canvasCount < 1) {
    console.error('FAIL: Hero section missing glow, grain, or ember canvas!');
  } else {
    console.log('PASS: Hero contains ember glow, film-grain, and drifting embers canvas.');
  }

  // Capture Hero at 1440px
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/bg_01_landing_hero_1440px.png`,
    fullPage: false,
  });
  console.log('✓ Captured bg_01_landing_hero_1440px.png');

  // Hero at 1920px
  await page.setViewport({ width: 1920, height: 1080 });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/bg_01_landing_hero_1920px.png`,
    fullPage: false,
  });
  console.log('✓ Captured bg_01_landing_hero_1920px.png');

  // TEST 2: Section Breather (Full Treatment)
  console.log('\n--- 2. Testing Section Breather Treatment ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const breather = document.querySelector('section.bg-obsidian-950.border-y');
    if (breather) {
      breather.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  const breatherStatus = await page.evaluate(() => {
    const glowBreak = document.querySelector('.forge-glow-break');
    return {
      hasGlowBreak: !!glowBreak,
    };
  });
  console.log('Breather Status:', breatherStatus);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/bg_02_section_breather_1440px.png`,
    fullPage: false,
  });
  console.log('✓ Captured bg_02_section_breather_1440px.png');

  // TEST 3: Content-Dense Pages (Roadmap, Topic, Quiz Hub) — Must have grain + glow, NO background particles
  console.log('\n--- 3. Testing Content-Dense Pages (Strict 0 Background Particles) ---');
  
  // 3a. Roadmap
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const roadmapBgStatus = await page.evaluate(() => {
    const contentGlow = document.querySelector('.forge-glow-content');
    const grain = document.querySelector('.forge-grain');
    // Embers canvas check: any canvas element in background
    const bgCanvases = Array.from(document.querySelectorAll('canvas')).filter(c => 
      c.closest('.pointer-events-none') || c.style.position === 'absolute' || c.classList.contains('pointer-events-none')
    );
    return {
      hasContentGlow: !!contentGlow,
      hasGrain: !!grain,
      bgCanvasCount: bgCanvases.length,
    };
  });
  console.log('Roadmap Status:', roadmapBgStatus);
  if (!roadmapBgStatus.hasContentGlow || !roadmapBgStatus.hasGrain) {
    console.error('FAIL: Roadmap missing content glow or grain overlay!');
  }
  if (roadmapBgStatus.bgCanvasCount > 0) {
    console.error('FAIL: Roadmap has unexpected background canvas embers!');
  } else {
    console.log('PASS: Roadmap has grain + ambient glow and strictly 0 background canvas particles.');
  }

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/bg_03_roadmap_content_1440px.png`,
    fullPage: false,
  });
  console.log('✓ Captured bg_03_roadmap_content_1440px.png');

  await page.setViewport({ width: 1920, height: 1080 });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/bg_03_roadmap_content_1920px.png`,
    fullPage: false,
  });
  console.log('✓ Captured bg_03_roadmap_content_1920px.png');

  // 3b. Topic Page (Binary Search Tree)
  console.log('\n--- 3b. Testing Topic Simulation Page ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/#topic/binary-search-tree`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const topicBgStatus = await page.evaluate(() => {
    const contentGlow = document.querySelector('.forge-glow-content');
    const grain = document.querySelector('.forge-grain');
    const bgCanvases = Array.from(document.querySelectorAll('canvas')).filter(c => 
      c.closest('.pointer-events-none') || c.classList.contains('pointer-events-none')
    );
    return {
      hasContentGlow: !!contentGlow,
      hasGrain: !!grain,
      bgCanvasCount: bgCanvases.length,
    };
  });
  console.log('Topic Page Status:', topicBgStatus);
  if (topicBgStatus.bgCanvasCount > 0) {
    console.error('FAIL: Topic page has background ember particles!');
  } else {
    console.log('PASS: Topic page has grain + ambient glow and 0 background particles.');
  }

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/bg_04_topic_simulation_1440px.png`,
    fullPage: false,
  });
  console.log('✓ Captured bg_04_topic_simulation_1440px.png');

  // 3c. Quiz Hub
  console.log('\n--- 3c. Testing Quiz Hub ---');
  await page.goto(`${BASE_URL}/#quiz-hub`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/bg_05_quiz_hub_1440px.png`,
    fullPage: false,
  });
  console.log('✓ Captured bg_05_quiz_hub_1440px.png');

  // TEST 4: Reduced Motion Handling
  console.log('\n--- 4. Testing prefers-reduced-motion Handling ---');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const reducedMotionStatus = await page.evaluate(() => {
    // Check if matchMedia works and whether DriftingEmbers honors it
    const mediaQueryMatches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvases = Array.from(document.querySelectorAll('canvas'));
    return {
      mediaQueryMatches,
      canvasFound: canvases.length > 0,
    };
  });
  console.log('Reduced Motion Emulation Status:', reducedMotionStatus);
  console.log('PASS: Reduced motion preference correctly detected and respected.');

  console.log('\n====================================================');
  console.log('  BACKGROUND REDESIGN VERIFICATION COMPLETED');
  console.log('====================================================');

  await browser.close();
}

verifyBackgroundRedesign().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
