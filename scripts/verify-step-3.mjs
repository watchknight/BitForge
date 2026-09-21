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

async function verifyStep3() {
  console.log('=== Verifying Step 3: Global Forge Color System Pass ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Bypass intro gate
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 1: Landing Page Hero & Archetypes Grid
  console.log('1. Checking Landing Page...');
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step3_01_landing_hero.png`,
    fullPage: false,
  });
  console.log('✓ Captured step3_01_landing_hero.png');

  // Screenshot 2: Roadmap with Tempered "Mastered" and Forge "Practicing" indicators
  console.log('2. Checking Roadmap Page...');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Set first topic to mastered, second to practicing to verify card badges
  await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem('bitforge_user_progress_v2') || '{}');
    progress.completedTopics = progress.completedTopics || {};
    progress.completedTopics['big-o-analysis'] = { topicId: 'big-o-analysis', status: 'mastered', quizPassed: true, quizScore: 3 };
    progress.completedTopics['memory-pointers'] = { topicId: 'memory-pointers', status: 'practicing' };
    localStorage.setItem('bitforge_user_progress_v2', JSON.stringify(progress));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step3_02_roadmap_mastered_tempered.png`,
    fullPage: false,
  });
  console.log('✓ Captured step3_02_roadmap_mastered_tempered.png');

  // Screenshot 3: Global Search Palette with Tempered Mastered badges
  console.log('3. Checking Global Search Command Palette...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Search all topics"]');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step3_03_global_search_tempered.png`,
    fullPage: false,
  });
  console.log('✓ Captured step3_03_global_search_tempered.png');
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));

  // Screenshot 4: Quiz Hub with Tempered/Heated Exam Cards and Options
  console.log('4. Checking Quiz Hub...');
  await page.goto(`${BASE_URL}/#quiz-hub`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step3_04_quiz_hub_cards.png`,
    fullPage: false,
  });
  console.log('✓ Captured step3_04_quiz_hub_cards.png');

  // Screenshot 5: Race Mode with Damascus Steel, Forge Flame, and Tempered Bars
  console.log('5. Checking Race Mode...');
  await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Advance race 8 steps
  for (let i = 0; i < 8; i++) {
    const forwardBtn = await page.$('button[title="Step Forward"]');
    if (forwardBtn) await forwardBtn.click();
    await new Promise((r) => setTimeout(r, 120));
  }

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step3_05_race_mode_metals.png`,
    fullPage: false,
  });
  console.log('✓ Captured step3_05_race_mode_metals.png');

  await browser.close();
  console.log('\n=== All Step 3 Visual Verifications Complete! ===');
}

verifyStep3().catch((err) => {
  console.error('Step 3 verification failed:', err);
  process.exit(1);
});
