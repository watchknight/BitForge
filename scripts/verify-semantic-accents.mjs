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

async function verifySemanticAccents() {
  console.log('=== Verifying Step 2 Semantic Accent System across Simulations ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // Set session flag to bypass welcome gate and reload
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // 1. Array Simulation (Quick Sort) - In the Forge active comparison
  console.log('Testing ArrayRenderer with Quick Sort...');
  await page.goto(`${BASE_URL}/#topic/quick-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Advance simulation 3 steps
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Interactive Simulation'));
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 400));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/semantic_01_array_in_the_forge.png`,
    fullPage: false,
  });
  console.log('✓ Captured semantic_01_array_in_the_forge.png');

  // 2. Array Simulation (Quick Sort) - Finished (Tempered blue-steel)
  console.log('Testing ArrayRenderer sorted Tempered state...');
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"]');
    if (slider) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(slider, slider.max);
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/semantic_02_array_tempered.png`,
    fullPage: false,
  });
  console.log('✓ Captured semantic_02_array_tempered.png');

  // 3. Graph Simulation (BFS) - In the Forge active node, Tempered visited nodes, Unforged unvisited nodes
  console.log('Testing GraphRenderer with BFS...');
  await page.goto(`${BASE_URL}/#topic/breadth-first-search`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Step forward twice
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Interactive Simulation'));
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 400));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/semantic_03_graph_bfs_states.png`,
    fullPage: false,
  });
  console.log('✓ Captured semantic_03_graph_bfs_states.png');

  // 4. Grid Simulation (Fibonacci DP) - Dependency lookup, Current cell, Computed cell
  console.log('Testing GridRenderer with Fibonacci DP...');
  await page.goto(`${BASE_URL}/#topic/fibonacci-dp`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Step forward 4 times
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Interactive Simulation'));
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 400));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/semantic_04_grid_dp_legend.png`,
    fullPage: false,
  });
  console.log('✓ Captured semantic_04_grid_dp_legend.png');

  // 5. Tree Simulation (BST) - In the Forge search & Tempered traversal
  console.log('Testing TreeRenderer with Binary Search Tree...');
  await page.goto(`${BASE_URL}/#topic/binary-search-tree`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 200));
  }

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Interactive Simulation'));
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 400));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/semantic_05_tree_bst.png`,
    fullPage: false,
  });
  console.log('✓ Captured semantic_05_tree_bst.png');

  // 6. Race Mode with all 3 sorting algorithms running
  console.log('Testing RaceMode with multi-lane simulation...');
  await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Click start race and let it run for 1.2s to capture active comparison & swap
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && (b.textContent.includes('Start Race') || b.textContent.includes('Replay Race')));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (clicked) {
    await new Promise((r) => setTimeout(r, 1200));
    // pause it to snapshot live comparison & tempered states
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Pause'));
      if (btn) btn.click();
    });
  }

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/semantic_06_race_mode_lanes.png`,
    fullPage: false,
  });
  console.log('✓ Captured semantic_06_race_mode_lanes.png');

  await browser.close();
  console.log('\n=== All Semantic Accent System Visual Verifications Complete! ===');
}

verifySemanticAccents().catch((err) => {
  console.error('Semantic verification failed:', err);
  process.exit(1);
});
