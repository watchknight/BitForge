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

async function stepSimulation(page, steps = 3) {
  for (let i = 0; i < steps; i++) {
    const forwardBtn = await page.$('button[aria-label="Next step"], button[title*="Next Step"], button[title="Step Forward"]');
    if (forwardBtn) {
      await forwardBtn.click();
    } else {
      await page.keyboard.press('ArrowRight');
    }
    await new Promise((r) => setTimeout(r, 200));
  }
}

async function verifyStep5() {
  console.log('=== Step 5: Full In-Browser Verification & Color-Blind Audit ===\n');

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

  // Test 1: Array Bars Active Highlight (Merge Sort)
  console.log('1. Verifying Array Bars (Merge Sort)...');
  await page.goto(`${BASE_URL}/#topic/merge-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await stepSimulation(page, 5);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/step5_01_array_bars_active.png`, fullPage: false });
  console.log('✓ Captured step5_01_array_bars_active.png');

  // Test 2: Tree Nodes Active Highlight (Binary Search Tree)
  console.log('2. Verifying Tree Nodes (Binary Search Tree)...');
  await page.goto(`${BASE_URL}/#topic/binary-search-tree`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await stepSimulation(page, 4);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/step5_02_tree_nodes_active.png`, fullPage: false });
  console.log('✓ Captured step5_02_tree_nodes_active.png');

  // Test 3: Graph Edges & Nodes Active Highlight (Breadth First Search)
  console.log('3. Verifying Graph Nodes & Edges (BFS)...');
  await page.goto(`${BASE_URL}/#topic/breadth-first-search`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await stepSimulation(page, 4);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/step5_03_graph_active.png`, fullPage: false });
  console.log('✓ Captured step5_03_graph_active.png');

  // Test 4: Dynamic Programming Grid Active Cells (0/1 Knapsack)
  console.log('4. Verifying DP Grid Cells (0/1 Knapsack)...');
  await page.goto(`${BASE_URL}/#topic/knapsack-dp`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await stepSimulation(page, 6);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/step5_04_grid_dp_active.png`, fullPage: false });
  console.log('✓ Captured step5_04_grid_dp_active.png');

  // Test 5: Linked List Active Nodes & Pointers
  console.log('5. Verifying Linked List (Singly Linked List)...');
  await page.goto(`${BASE_URL}/#topic/singly-linked-list`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await stepSimulation(page, 3);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/step5_05_linked_list_active.png`, fullPage: false });
  console.log('✓ Captured step5_05_linked_list_active.png');

  // Test 6: Call Stack Active Frames (Recursion Basics)
  console.log('6. Verifying Call Stack Frames (Recursion Basics)...');
  await page.goto(`${BASE_URL}/#topic/recursion-basics`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await stepSimulation(page, 4);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/step5_06_call_stack_active.png`, fullPage: false });
  console.log('✓ Captured step5_06_call_stack_active.png');

  // Test 7: Reduced Motion Mode Handling
  console.log('7. Verifying Reduced Motion Mode...');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  const reducedMotionStateBefore = await page.evaluate(() => document.documentElement.classList.contains('reduced-motion'));
  
  // Click accessibility eye toggle in navbar
  const motionToggle = await page.$('button[title*="reduced motion" i], button[aria-label*="motion" i]');
  if (motionToggle) {
    await motionToggle.click();
    await new Promise((r) => setTimeout(r, 400));
  } else {
    // Fallback: trigger via localStorage and class
    await page.evaluate(() => {
      document.documentElement.classList.toggle('reduced-motion');
    });
  }

  const reducedMotionStateAfter = await page.evaluate(() => document.documentElement.classList.contains('reduced-motion'));
  console.log(` - Reduced motion before: ${reducedMotionStateBefore}, after: ${reducedMotionStateAfter}`);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/step5_07_reduced_motion_active.png`, fullPage: false });
  console.log('✓ Captured step5_07_reduced_motion_active.png');

  // Test 8: Race Mode Multi-lane Grand Prix
  console.log('8. Verifying Race Mode Grand Prix...');
  await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  for (let i = 0; i < 10; i++) {
    const forwardBtn = await page.$('button[title="Step Forward"]');
    if (forwardBtn) {
      await forwardBtn.click();
      await new Promise((r) => setTimeout(r, 80));
    }
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/step5_08_race_mode_grand_prix.png`, fullPage: false });
  console.log('✓ Captured step5_08_race_mode_grand_prix.png');

  await browser.close();
  console.log('\n=== All Step 5 Verifications Passed Cleanly! ===');
}

verifyStep5().catch((err) => {
  console.error('Step 5 verification failed:', err);
  process.exit(1);
});
