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

async function verifyTheForge() {
  console.log('=== Verifying "The Forge" Color Overhaul ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Landing Page with warm near-black, bone headline, and forge embers
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/forge_01_landing_hero.png`,
    fullPage: false,
  });
  console.log('✓ Captured forge_01_landing_hero.png');

  // 2. Roadmap Page with tempered steel badges and forge flame progress
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/forge_02_roadmap_mastery.png`,
    fullPage: false,
  });
  console.log('✓ Captured forge_02_roadmap_mastery.png');

  // 3. Quick Sort simulation running with raw iron, heated orange, and blue-steel bars
  await page.goto(`${BASE_URL}/#topic/quick-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Step simulation forward 4 times
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 250));
  }

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/forge_03_quick_sort_simulation.png`,
    fullPage: false,
  });
  console.log('✓ Captured forge_03_quick_sort_simulation.png');

  // 3b. Jump to end of Quick Sort via timeline slider to verify tempered blue-steel sorted bars
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"]');
    if (slider) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(slider, slider.max);
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const engineTitle = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Interactive Simulation'));
    if (engineTitle) {
      engineTitle.scrollIntoView({ block: 'start' });
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/forge_05_quick_sort_finished.png`,
    fullPage: false,
  });
  console.log('✓ Captured forge_05_quick_sort_finished.png');

  // 4. Race Mode with metallic themes
  await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/forge_04_race_mode_metals.png`,
    fullPage: false,
  });
  console.log('✓ Captured forge_04_race_mode_metals.png');

  await browser.close();
  console.log('\n=== All The Forge Visual Checks Complete! ===');
}

verifyTheForge().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
