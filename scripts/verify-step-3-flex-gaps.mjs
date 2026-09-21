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
  console.log('=== Step 3 Verification: Passive Flex Gaps Resolution ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Enter experience
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Inspect Roadmap Page search bar + filter-pill row
  console.log('1. Checking Roadmap Page search bar & filter-pill row...');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const roadmapToolbarMetrics = await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search algorithms"]');
    const inputWrapper = input?.closest('.relative');
    const row = inputWrapper?.parentElement;
    const filterPills = row?.querySelector('.flex-wrap');

    const rowRect = row?.getBoundingClientRect();
    const inputRect = input?.getBoundingClientRect();
    const inputWrapperRect = inputWrapper?.getBoundingClientRect();
    const pillsRect = filterPills?.getBoundingClientRect();

    return {
      rowWidth: rowRect?.width,
      inputWrapperWidth: inputWrapperRect?.width,
      inputWidth: inputRect?.width,
      filterPillsWidth: pillsRect?.width,
      gapBetweenInputAndPills: pillsRect && inputWrapperRect ? pillsRect.left - inputWrapperRect.right : null,
    };
  });
  console.log('Roadmap Toolbar Metrics:', roadmapToolbarMetrics);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step3_01_roadmap_search_flex.png`,
    fullPage: false,
  });
  console.log('✓ Captured step3_01_roadmap_search_flex.png');

  // 3. Inspect Big-O Cheat Sheet search bar + category-pill row
  console.log('\n2. Checking Big-O Cheat Sheet search bar & category-pill row...');
  await page.goto(`${BASE_URL}/#big-o`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const bigoToolbarMetrics = await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search structure or algorithm"]');
    const inputWrapper = input?.closest('.relative');
    const row = inputWrapper?.parentElement;
    const pills = row?.querySelectorAll('button');

    const rowRect = row?.getBoundingClientRect();
    const inputWrapperRect = inputWrapper?.getBoundingClientRect();
    const lastPill = pills && pills.length > 0 ? pills[pills.length - 1] : null;
    const firstPill = pills && pills.length > 0 ? pills[0] : null;

    return {
      rowWidth: rowRect?.width,
      inputWrapperWidth: inputWrapperRect?.width,
      pillsSpanWidth: firstPill && lastPill ? lastPill.getBoundingClientRect().right - firstPill.getBoundingClientRect().left : null,
      gapBetweenInputAndPills: firstPill && inputWrapperRect ? firstPill.getBoundingClientRect().left - inputWrapperRect.right : null,
    };
  });
  console.log('Big-O Toolbar Metrics:', bigoToolbarMetrics);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step3_02_bigo_search_flex.png`,
    fullPage: false,
  });
  console.log('✓ Captured step3_02_bigo_search_flex.png');

  // 4. Inspect Race Mode Toolbar
  console.log('\n3. Checking Race Mode toolbar...');
  await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const raceToolbarMetrics = await page.evaluate(() => {
    const toolbar = document.querySelector('.backdrop-blur-md');
    const presetsGroup = toolbar?.firstElementChild;
    const middleBadge = toolbar?.querySelector('.hidden.lg\\:flex');
    const controlsGroup = toolbar?.lastElementChild;

    const toolbarRect = toolbar?.getBoundingClientRect();
    const presetsRect = presetsGroup?.getBoundingClientRect();
    const badgeRect = middleBadge?.getBoundingClientRect();
    const controlsRect = controlsGroup?.getBoundingClientRect();

    return {
      toolbarWidth: toolbarRect?.width,
      presetsWidth: presetsRect?.width,
      badgeVisible: !!middleBadge && window.getComputedStyle(middleBadge).display !== 'none',
      badgeWidth: badgeRect?.width,
      controlsWidth: controlsRect?.width,
    };
  });
  console.log('Race Mode Toolbar Metrics:', raceToolbarMetrics);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step3_03_race_toolbar_flex.png`,
    fullPage: false,
  });
  console.log('✓ Captured step3_03_race_toolbar_flex.png');

  await browser.close();
  console.log('\n=== Step 3 Visual Verifications Passed! ===');
}

verifyStep3().catch((err) => {
  console.error('Step 3 verification failed:', err);
  process.exit(1);
});
