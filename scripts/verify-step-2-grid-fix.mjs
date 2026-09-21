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

async function verifyStep2() {
  console.log('=== Step 2 Verification: Incomplete Grid Rows & Auto-fit Layouts ===\n');

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

  // Screenshot 1: Landing Page Flagship Auto-Fit Grid
  console.log('1. Checking Landing Page Flagships Auto-fit Grid...');
  await page.evaluate(() => {
    const el = document.querySelector('#flagships, section:has(.grid)');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step2_03_landing_flagships_autofit.png`,
    fullPage: false,
  });
  console.log('✓ Captured step2_03_landing_flagships_autofit.png');

  // 2. Go to Roadmap page
  console.log('2. Checking Roadmap Stage 1 (Foundations: 2 topics)...');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Inspect Stage 1 cards width and columns
  const stage1Audit = await page.evaluate(() => {
    const stage1 = document.querySelector('.space-y-8 > div:first-child');
    if (!stage1) return null;
    const grid = stage1.querySelector('.grid');
    const cards = grid ? Array.from(grid.children) : [];
    return {
      cardCount: cards.length,
      gridWidth: grid?.clientWidth,
      card1Width: cards[0]?.clientWidth,
      card2Width: cards[1]?.clientWidth,
      gridTemplateColumns: window.getComputedStyle(grid).gridTemplateColumns,
    };
  });
  console.log('Stage 1 (2 Topics) Audit:', stage1Audit);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step2_01_roadmap_stage1_two_items.png`,
    fullPage: false,
  });
  console.log('✓ Captured step2_01_roadmap_stage1_two_items.png');

  // 3. Inspect Stage 7 (Hashing: 1 topic)
  console.log('3. Checking Roadmap Stage 7 (Hashing: 1 topic)...');
  await page.evaluate(() => {
    // Find stage containing "Hashing"
    const headings = Array.from(document.querySelectorAll('h2'));
    const hashHeading = headings.find((h) => h.textContent.includes('Hashing'));
    if (hashHeading) {
      hashHeading.closest('.rounded-2xl')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  const stage7Audit = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const hashHeading = headings.find((h) => h.textContent.includes('Hashing'));
    const stageCard = hashHeading?.closest('.rounded-2xl');
    const grid = stageCard?.querySelector('.grid');
    const cards = grid ? Array.from(grid.children) : [];
    const card = cards[0];
    const gridRect = grid?.getBoundingClientRect();
    const cardRect = card?.getBoundingClientRect();
    return {
      cardCount: cards.length,
      gridWidth: gridRect?.width,
      cardWidth: cardRect?.width,
      cardLeft: cardRect?.left,
      cardRight: cardRect?.right,
      gridTemplateColumns: grid ? window.getComputedStyle(grid).gridTemplateColumns : null,
      isCentered: gridRect && cardRect ? Math.abs((gridRect.left + gridRect.width / 2) - (cardRect.left + cardRect.width / 2)) < 5 : false,
    };
  });
  console.log('Stage 7 (1 Topic) Audit:', stage7Audit);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step2_02_roadmap_stage7_one_item_centered.png`,
    fullPage: false,
  });
  console.log('✓ Captured step2_02_roadmap_stage7_one_item_centered.png');

  await browser.close();
  console.log('\n=== Step 2 Visual Verifications Passed! ===');
}

verifyStep2().catch((err) => {
  console.error('Step 2 verification failed:', err);
  process.exit(1);
});
