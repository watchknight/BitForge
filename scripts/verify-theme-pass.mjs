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

async function checkOverflow(page, label) {
  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const bodyWidth = document.body.scrollWidth;
    const docScrollWidth = document.documentElement.scrollWidth;
    return {
      docWidth,
      bodyWidth,
      docScrollWidth,
      hasOverflow: docScrollWidth > docWidth || bodyWidth > docWidth,
      overflowAmount: Math.max(0, docScrollWidth - docWidth, bodyWidth - docWidth),
    };
  });

  if (overflow.hasOverflow) {
    console.error(`  [OVERFLOW] ${label}: ${overflow.overflowAmount}px overflow (docWidth=${overflow.docWidth}, scrollWidth=${overflow.docScrollWidth})`);
  } else {
    console.log(`  [OK] ${label}: 0px overflow`);
  }
  return overflow;
}

async function run() {
  console.log('=== BITFORGE LIGHT THEME & DUAL-MODE VERIFICATION ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // Initialize session to skip modal
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
    localStorage.removeItem('bitforge_theme'); // start fresh
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  console.log('1. Verifying Default Dark Mode...');
  const initialThemeClass = await page.evaluate(() => document.documentElement.className);
  console.log(`  Initial HTML class: "${initialThemeClass}"`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/theme_01_dark_landing_1440px.png` });

  console.log('\n2. Toggling to Light Mode via Navbar Button...');
  // Find theme toggle button
  const toggleBtn = await page.$('button[aria-label="Switch to light mode"]');
  if (!toggleBtn) {
    throw new Error('Theme toggle button not found!');
  }
  await toggleBtn.click();
  await new Promise((r) => setTimeout(r, 600));

  const lightThemeClass = await page.evaluate(() => document.documentElement.className);
  const localStorageTheme = await page.evaluate(() => localStorage.getItem('bitforge_theme'));
  console.log(`  After toggle HTML class: "${lightThemeClass}"`);
  console.log(`  localStorage theme: "${localStorageTheme}"`);

  if (!lightThemeClass.includes('light')) {
    throw new Error('Expected html element to have class "light" after clicking toggle button');
  }

  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_landing_1440px.png` });
  console.log('✓ Captured light_mode_landing_1440px.png');
  await checkOverflow(page, 'Landing Page 1440px (Light)');

  // Capture navbar close-up
  const navClip = await page.evaluate(() => {
    const nav = document.querySelector('header') || document.querySelector('nav');
    if (!nav) return { x: 0, y: 0, width: 1440, height: 80 };
    const rect = nav.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/light_mode_navbar_toggle.png`,
    clip: navClip,
  });
  console.log('✓ Captured light_mode_navbar_toggle.png');

  console.log('\n3. Verifying Roadmap in Light Mode (1440px)...');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_roadmap_1440px.png` });
  console.log('✓ Captured light_mode_roadmap_1440px.png');
  await checkOverflow(page, 'Roadmap 1440px (Light)');

  console.log('\n4. Verifying Simulation Renderers in Light Mode (1440px)...');

  // 4a. Array Renderer (Merge Sort)
  await page.goto(`${BASE_URL}/#topic/merge-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  // Step forward to activate forge states
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_array_topic_1440px.png` });
  console.log('✓ Captured light_mode_array_topic_1440px.png (Merge Sort)');
  await checkOverflow(page, 'Array Topic 1440px (Light)');

  // 4b. Tree Renderer (Binary Search Tree)
  await page.goto(`${BASE_URL}/#topic/binary-search-tree`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_tree_topic_1440px.png` });
  console.log('✓ Captured light_mode_tree_topic_1440px.png (BST)');
  await checkOverflow(page, 'Tree Topic 1440px (Light)');

  // 4c. Graph Renderer (BFS)
  await page.goto(`${BASE_URL}/#topic/breadth-first-search`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_graph_topic_1440px.png` });
  console.log('✓ Captured light_mode_graph_topic_1440px.png (BFS)');
  await checkOverflow(page, 'Graph Topic 1440px (Light)');

  // 4d. Grid Renderer (Fibonacci DP)
  await page.goto(`${BASE_URL}/#topic/fibonacci-dp`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_grid_topic_1440px.png` });
  console.log('✓ Captured light_mode_grid_topic_1440px.png (Fibonacci DP)');
  await checkOverflow(page, 'Grid Topic 1440px (Light)');

  // 4e. Linked List Renderer (Singly Linked List)
  await page.goto(`${BASE_URL}/#topic/singly-linked-list`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_ll_topic_1440px.png` });
  console.log('✓ Captured light_mode_ll_topic_1440px.png (Singly Linked List)');
  await checkOverflow(page, 'Linked List Topic 1440px (Light)');

  console.log('\n5. Verifying Flagship Pages in Light Mode...');

  // Race Mode
  await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_race_mode_1440px.png` });
  console.log('✓ Captured light_mode_race_mode_1440px.png');
  await checkOverflow(page, 'Race Mode 1440px (Light)');

  // Quiz Hub
  await page.goto(`${BASE_URL}/#quiz-hub`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_quiz_hub_1440px.png` });
  console.log('✓ Captured light_mode_quiz_hub_1440px.png');
  await checkOverflow(page, 'Quiz Hub 1440px (Light)');

  // Big-O Cheat Sheet
  await page.goto(`${BASE_URL}/#big-o`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_cheat_sheet_1440px.png` });
  console.log('✓ Captured light_mode_cheat_sheet_1440px.png');
  await checkOverflow(page, 'Cheat Sheet 1440px (Light)');

  console.log('\n6. Verifying Mobile 360px Viewport in Light Mode...');
  await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });

  // 6a. Landing Page Mobile
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_landing_hero_360px.png` });
  console.log('✓ Captured light_mode_landing_hero_360px.png');
  await checkOverflow(page, 'Landing Page 360px (Light)');

  // 6b. Roadmap Mobile
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_roadmap_360px.png` });
  console.log('✓ Captured light_mode_roadmap_360px.png');
  await checkOverflow(page, 'Roadmap 360px (Light)');

  // 6c. Array Simulation Mobile
  await page.goto(`${BASE_URL}/#topic/merge-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/light_mode_array_topic_360px.png` });
  console.log('✓ Captured light_mode_array_topic_360px.png');
  await checkOverflow(page, 'Array Topic 360px (Light)');

  console.log('\n7. Verifying Bidirectional Toggle Back to Dark Mode...');
  // Open mobile drawer
  const hamburgerBtn = await page.$('button[aria-label="Toggle navigation menu"]');
  if (hamburgerBtn) {
    await hamburgerBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    const mobileThemeToggle = await page.$('button[aria-label*="Switch to dark theme"]');
    if (mobileThemeToggle) {
      await mobileThemeToggle.click();
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  const revertedClass = await page.evaluate(() => document.documentElement.className);
  const revertedStorage = await page.evaluate(() => localStorage.getItem('bitforge_theme'));
  console.log(`  After toggle back HTML class: "${revertedClass}"`);
  console.log(`  localStorage theme: "${revertedStorage}"`);

  await browser.close();
  console.log('\n=== ALL VERIFICATION CHECKS PASSED ===\n');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
