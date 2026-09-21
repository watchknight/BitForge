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

async function verifyStep2Simulations() {
  console.log('===============================================================');
  console.log('  BITFORGE STEP 2: MOBILE SIMULATION VIEWPORT VERIFICATION');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 360, height: 800 },
  });

  const page = await browser.newPage();

  // Bypass intro gate
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => sessionStorage.setItem('bitforge_experience_entered', 'true'));
  await page.reload({ waitUntil: 'networkidle0' });

  // 1. TEST TREE SIMULATION (Binary Search Tree)
  console.log('--- 1. Testing Tree Simulation (BST) at 360px ---');
  await page.goto(`${BASE_URL}/#topic/binary-search-tree`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const treeMetrics = await page.evaluate(() => {
    const viewport = document.querySelector('[aria-label="Fit to screen"]');
    const zoomInBtn = document.querySelector('[aria-label="Zoom in"]');
    const zoomOutBtn = document.querySelector('[aria-label="Zoom out"]');
    const zoomText = document.querySelector('[aria-label="Zoom out"]')?.parentElement?.querySelector('span')?.textContent;
    const svg = document.querySelector('svg');
    const docScrollWidth = document.documentElement.scrollWidth;

    return {
      hasFitButton: !!viewport,
      hasZoomIn: !!zoomInBtn,
      hasZoomOut: !!zoomOutBtn,
      initialZoomText: zoomText,
      svgWidth: svg?.getAttribute('width'),
      svgHeight: svg?.getAttribute('height'),
      docScrollWidth,
    };
  });
  console.log('Tree Initial Metrics:', treeMetrics);

  // Test Zoom In interaction
  const afterZoomInText = await page.evaluate(() => {
    const btn = document.querySelector('[aria-label="Zoom in"]');
    if (btn) {
      btn.scrollIntoView({ behavior: 'instant', block: 'center' });
      btn.click();
    }
    return btn?.parentElement?.querySelector('span')?.textContent;
  });
  await new Promise((r) => setTimeout(r, 250));
  const verifiedZoomInText = await page.evaluate(() => {
    return document.querySelector('[aria-label="Zoom out"]')?.parentElement?.querySelector('span')?.textContent;
  });
  console.log(`Zoom In Test: ${treeMetrics.initialZoomText} -> ${verifiedZoomInText}`);

  // Test Fit to Screen interaction
  await page.evaluate(() => {
    const fitBtn = document.querySelector('[aria-label="Fit to screen"]');
    if (fitBtn) fitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 250));
  const afterFitText = await page.evaluate(() => {
    return document.querySelector('[aria-label="Zoom out"]')?.parentElement?.querySelector('span')?.textContent;
  });
  console.log(`Fit to Screen Test: scaled to ${afterFitText}`);

  // Capture Tree card screenshot
  const treeCard = await page.$('.min-h-\\[340px\\]') || await page.$('.min-h-\\[360px\\]');
  if (treeCard) {
    await treeCard.screenshot({ path: `${SCREENSHOT_DIR}/mobile_01_tree_with_zoom_360px.png` });
    console.log('✓ Captured mobile_01_tree_with_zoom_360px.png');
  }

  // 2. TEST GRAPH SIMULATION (BFS)
  console.log('\n--- 2. Testing Graph Simulation (BFS) at 360px ---');
  await page.goto(`${BASE_URL}/#topic/breadth-first-search`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const graphMetrics = await page.evaluate(() => {
    const fitBtn = document.querySelector('[aria-label="Fit to screen"]');
    const docScrollWidth = document.documentElement.scrollWidth;
    const queueBox = document.querySelector('[style*="overscroll-behavior-x"]');
    return {
      hasFitButton: !!fitBtn,
      docScrollWidth,
      hasContainedQueue: !!queueBox,
    };
  });
  console.log('Graph Metrics:', graphMetrics);

  const graphCard = await page.$('.min-h-\\[340px\\]') || await page.$('.min-h-\\[360px\\]');
  if (graphCard) {
    await graphCard.screenshot({ path: `${SCREENSHOT_DIR}/mobile_02_graph_with_pan_360px.png` });
    console.log('✓ Captured mobile_02_graph_with_pan_360px.png');
  }

  // 3. TEST ARRAY SIMULATION (Merge Sort)
  console.log('\n--- 3. Testing Array Simulation (Merge Sort) at 360px ---');
  await page.goto(`${BASE_URL}/#topic/merge-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const arrayMetrics = await page.evaluate(() => {
    const momentumContainer = document.querySelector('[style*="overscroll-behavior-x"]');
    const cards = Array.from(document.querySelectorAll('.aspect-square'));
    const docScrollWidth = document.documentElement.scrollWidth;
    return {
      hasMomentumContainer: !!momentumContainer,
      cardCount: cards.length,
      firstCardWidth: cards[0] ? Math.round(cards[0].getBoundingClientRect().width) : 0,
      docScrollWidth,
    };
  });
  console.log('Array Metrics:', arrayMetrics);

  const arrayCard = await page.$('.min-h-\\[340px\\]') || await page.$('.min-h-\\[360px\\]');
  if (arrayCard) {
    await arrayCard.screenshot({ path: `${SCREENSHOT_DIR}/mobile_03_array_momentum_scroll_360px.png` });
    console.log('✓ Captured mobile_03_array_momentum_scroll_360px.png');
  }

  // 4. TEST GRID SIMULATION (Knapsack DP)
  console.log('\n--- 4. Testing Grid Simulation (Knapsack DP) at 360px ---');
  await page.goto(`${BASE_URL}/#topic/knapsack-dp`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const gridMetrics = await page.evaluate(() => {
    const table = document.querySelector('table');
    const stickyCells = document.querySelectorAll('td.sticky');
    const docScrollWidth = document.documentElement.scrollWidth;
    return {
      hasTable: !!table,
      stickyRowCount: stickyCells.length,
      docScrollWidth,
    };
  });
  console.log('Grid Metrics:', gridMetrics);

  const gridCard = await page.$('.min-h-\\[340px\\]') || await page.$('.min-h-\\[360px\\]');
  if (gridCard) {
    await gridCard.screenshot({ path: `${SCREENSHOT_DIR}/mobile_04_grid_knapsack_scroll_360px.png` });
    console.log('✓ Captured mobile_04_grid_knapsack_scroll_360px.png');
  }

  // 5. TEST LINKED LIST SIMULATION (Singly Linked List)
  console.log('\n--- 5. Testing Linked List Simulation at 360px ---');
  await page.goto(`${BASE_URL}/#topic/singly-linked-list`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const llMetrics = await page.evaluate(() => {
    const headBadge = Array.from(document.querySelectorAll('span')).find(s => s.textContent?.trim() === 'HEAD');
    const docScrollWidth = document.documentElement.scrollWidth;
    return {
      hasHeadBadge: !!headBadge,
      headRect: headBadge ? headBadge.getBoundingClientRect() : null,
      docScrollWidth,
    };
  });
  console.log('Linked List Metrics:', {
    hasHeadBadge: llMetrics.hasHeadBadge,
    headLeft: llMetrics.headRect ? Math.round(llMetrics.headRect.left) : null,
    docScrollWidth: llMetrics.docScrollWidth,
  });

  const llCard = await page.$('.min-h-\\[340px\\]') || await page.$('.min-h-\\[360px\\]');
  if (llCard) {
    await llCard.screenshot({ path: `${SCREENSHOT_DIR}/mobile_05_linked_list_scroll_360px.png` });
    console.log('✓ Captured mobile_05_linked_list_scroll_360px.png');
  }

  // 6. TEST TABLET (768px)
  console.log('\n--- 6. Testing Tablet Viewport (768px) ---');
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(`${BASE_URL}/#topic/binary-search-tree`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  const tabletCard = await page.$('.min-h-\\[340px\\]') || await page.$('.min-h-\\[360px\\]');
  if (tabletCard) {
    await tabletCard.screenshot({ path: `${SCREENSHOT_DIR}/mobile_06_tree_tablet_768px.png` });
    console.log('✓ Captured mobile_06_tree_tablet_768px.png');
  }

  await browser.close();
  console.log('\n===============================================================');
  console.log('  STEP 2 VERIFICATION COMPLETED');
  console.log('===============================================================');
}

verifyStep2Simulations().catch((err) => {
  console.error('Step 2 verification failed:', err);
  process.exit(1);
});
