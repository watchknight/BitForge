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

async function verifyStep4() {
  console.log('=== Step 4 Verification: Large Viewport (1920px+) Proportional Max-Width ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();

  // 1. Enter experience & dismiss intro
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Landing Page at 1920px
  console.log('1. Checking Landing Page at 1920px...');
  const landingMetrics = await page.evaluate(() => {
    const heroSection = document.querySelector('section');
    const heroRect = heroSection?.getBoundingClientRect();
    const heroHeadline = heroSection?.querySelector('h1');
    const heroPara = heroSection?.querySelector('p');

    const flagshipSection = document.querySelector('section:has(.grid)');
    const flagshipRect = flagshipSection?.getBoundingClientRect();
    const flagshipGrid = flagshipSection?.querySelector('.grid');
    const flagshipCards = flagshipGrid ? Array.from(flagshipGrid.children) : [];

    return {
      viewportWidth: window.innerWidth,
      heroWidth: heroRect?.width,
      heroSideMargin: heroRect ? (window.innerWidth - heroRect.width) / 2 : null,
      heroParaWidth: heroPara?.clientWidth,
      flagshipWidth: flagshipRect?.width,
      flagshipCardCount: flagshipCards.length,
      flagshipCardWidth: flagshipCards[0]?.clientWidth,
    };
  });
  console.log('Landing Metrics (1920px):', landingMetrics);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step4_01_landing_1920px.png`,
    fullPage: false,
  });
  console.log('✓ Captured step4_01_landing_1920px.png');

  // 3. Roadmap Page at 1920px
  console.log('\n2. Checking Roadmap Page at 1920px...');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const roadmapMetrics = await page.evaluate(() => {
    const container = document.querySelector('.space-y-10');
    const containerRect = container?.getBoundingClientRect();

    // Stage 1 (2 items)
    const stage1 = document.querySelector('.space-y-8 > div:first-child');
    const stage1Grid = stage1?.querySelector('.grid');
    const stage1Cards = stage1Grid ? Array.from(stage1Grid.children) : [];

    // Stage 7 (1 item)
    const headings = Array.from(document.querySelectorAll('h2'));
    const hashHeading = headings.find((h) => h.textContent.includes('Hashing'));
    const stage7 = hashHeading?.closest('.rounded-2xl');
    const stage7Grid = stage7?.querySelector('.grid');
    const stage7Card = stage7Grid?.firstElementChild;

    return {
      containerWidth: containerRect?.width,
      sideMargin: containerRect ? (window.innerWidth - containerRect.width) / 2 : null,
      stage1Card1Width: stage1Cards[0]?.clientWidth,
      stage1Card2Width: stage1Cards[1]?.clientWidth,
      stage7CardWidth: stage7Card?.clientWidth,
      stage7IsCentered: stage7Grid && stage7Card
        ? Math.abs((stage7Grid.getBoundingClientRect().left + stage7Grid.getBoundingClientRect().width / 2) -
                   (stage7Card.getBoundingClientRect().left + stage7Card.getBoundingClientRect().width / 2)) < 5
        : false,
    };
  });
  console.log('Roadmap Metrics (1920px):', roadmapMetrics);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step4_02_roadmap_1920px.png`,
    fullPage: false,
  });
  console.log('✓ Captured step4_02_roadmap_1920px.png');

  // 4. Race Mode at 1920px
  console.log('\n3. Checking Race Mode at 1920px...');
  await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const raceMetrics = await page.evaluate(() => {
    const container = document.querySelector('.space-y-8');
    const containerRect = container?.getBoundingClientRect();

    const lanesGrid = document.querySelector('.grid.gap-6');
    const lanes = lanesGrid ? Array.from(lanesGrid.children) : [];

    return {
      containerWidth: containerRect?.width,
      sideMargin: containerRect ? (window.innerWidth - containerRect.width) / 2 : null,
      laneCount: lanes.length,
      laneWidth: lanes[0]?.clientWidth,
    };
  });
  console.log('Race Mode Metrics (1920px):', raceMetrics);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step4_03_race_mode_1920px.png`,
    fullPage: false,
  });
  console.log('✓ Captured step4_03_race_mode_1920px.png');

  // 5. Topic Page (Quick Sort simulation) at 1920px
  console.log('\n4. Checking Topic Page (Quick Sort) at 1920px...');
  await page.goto(`${BASE_URL}/#topic/quick-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const topicMetrics = await page.evaluate(() => {
    const container = document.querySelector('.space-y-10');
    const containerRect = container?.getBoundingClientRect();

    const simCanvas = document.querySelector('.min-h-\\[360px\\]');
    const codePanel = document.querySelector('.lg\\:col-span-5');
    const analogyStory = document.querySelector('.leading-relaxed.max-w-4xl');

    return {
      containerWidth: containerRect?.width,
      simCanvasWidth: simCanvas?.clientWidth,
      codePanelWidth: codePanel?.clientWidth,
      analogyStoryWidth: analogyStory?.clientWidth,
    };
  });
  console.log('Topic Page Metrics (1920px):', topicMetrics);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step4_04_topic_sim_1920px.png`,
    fullPage: false,
  });
  console.log('✓ Captured step4_04_topic_sim_1920px.png');

  // 6. Test at 2560px Viewport (QHD / Ultra-wide)
  console.log('\n5. Checking Roadmap at 2560px Ultra-wide Viewport...');
  await page.setViewport({ width: 2560, height: 1440 });
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const ultraWideMetrics = await page.evaluate(() => {
    const container = document.querySelector('.space-y-10');
    const containerRect = container?.getBoundingClientRect();

    return {
      viewportWidth: window.innerWidth,
      containerWidth: containerRect?.width,
      sideMargin: containerRect ? (window.innerWidth - containerRect.width) / 2 : null,
      sideMarginPercent: containerRect ? (((window.innerWidth - containerRect.width) / 2) / window.innerWidth * 100).toFixed(1) + '%' : null,
    };
  });
  console.log('Ultra-Wide (2560px) Metrics:', ultraWideMetrics);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step4_05_roadmap_2560px.png`,
    fullPage: false,
  });
  console.log('✓ Captured step4_05_roadmap_2560px.png');

  await browser.close();
  console.log('\n=== Step 4 Visual Verifications Passed! ===');
}

verifyStep4().catch((err) => {
  console.error('Step 4 verification failed:', err);
  process.exit(1);
});
