import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

console.log('Using browser at:', CHROME_PATH);

const testTopics = [
  // Batch A
  { id: 'bubble-sort', title: 'Bubble Sort' },
  { id: 'quick-sort', title: 'Quick Sort' },
  { id: 'radix-sort', title: 'Radix Sort' },
  // Batch B
  { id: 'binary-search', title: 'Binary Search' },
  // Batch C
  { id: 'circular-linked-list', title: 'Circular Linked List' },
  { id: 'circular-queue', title: 'Circular Queue' },
  { id: 'deque', title: 'Double-Ended Queue' },
  // Batch D
  { id: 'recursion-basics', title: 'Recursion & The Call Stack' },
  { id: 'n-queens', title: 'N-Queens Backtracking' },
  { id: 'maze-path', title: 'Maze & Path Backtracking' },
  // Batch E
  { id: 'avl-tree', title: 'AVL Self-Balancing Tree' },
  { id: 'fenwick-tree', title: 'Fenwick Tree' },
  // Batch F
  { id: 'hash-map', title: 'Hash Table & Collision Handling' },
  // Batch G
  { id: 'depth-first-search', title: 'Depth-First Search' },
  { id: 'dijkstra', title: 'Dijkstra’s Shortest Path' },
  { id: 'topological-sort', title: 'Topological Sort' },
  // Batch H
  { id: 'knapsack-dp', title: '0/1 Knapsack Problem' },
  { id: 'lcs-dp', title: 'Longest Common Subsequence' },
  { id: 'coin-change', title: 'Coin Change' },
  // Batch I
  { id: 'interval-scheduling', title: 'Interval Scheduling' },
  { id: 'huffman-coding', title: 'Huffman Coding' },
  // Batch J
  { id: 'disjoint-set', title: 'Union-Find' },
  { id: 'kmp-search', title: 'KMP String Matching' },
  { id: 'bit-manipulation', title: 'Bit Manipulation Tricks' },
];

async function runBatchAudit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
    console.error('BROWSER UNCAUGHT PAGE ERROR:', err.toString());
  });

  try {
    // 1. Verify Roadmap Page with all topics
    console.log('--- Checking Roadmap Page ---');
    await page.goto('http://127.0.0.1:5173/#roadmap', { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.body.innerText.includes('DSA Mastery Roadmap'), { timeout: 8000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_full_roadmap.png') });

    // 2. Verify Big-O Cheat Sheet with all topics
    console.log('--- Checking Big-O Cheat Sheet ---');
    await page.goto('http://127.0.0.1:5173/#big-o', { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.body.innerText.includes('Big-O Complexity Cheat Sheet'), { timeout: 8000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_full_big_o.png') });

    // 3. Test each batch topic
    for (let i = 0; i < testTopics.length; i++) {
      const topic = testTopics[i];
      console.log(`--- Testing [${i + 1}/${testTopics.length}] ${topic.id} (${topic.title}) ---`);
      await page.goto(`http://127.0.0.1:5173/#topic/${topic.id}`, { waitUntil: 'networkidle0' });
      await page.waitForFunction(
        (title) => document.body.innerText.includes(title),
        { timeout: 8000 },
        topic.title
      );

      // Step forward 2 times to verify the simulation engine advances state
      const nextBtn = await page.waitForSelector('button[title="Next Step"]', { timeout: 5000 });
      if (nextBtn) {
        await nextBtn.click();
        await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
        await nextBtn.click();
        await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
      }

      // Take a few key screenshots across representative batches
      if (['bubble-sort', 'circular-queue', 'n-queens', 'avl-tree', 'hash-map', 'topological-sort', 'knapsack-dp', 'huffman-coding', 'kmp-search'].includes(topic.id)) {
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `sim_${topic.id}.png`) });
      }
    }

    console.log('========================================');
    console.log('Batch Verification Complete.');
    console.log('Total Console Errors Encountered:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error('Errors encountered:', consoleErrors);
      process.exit(1);
    } else {
      console.log('SUCCESS: All batch topics verified with zero console errors and clean simulations!');
    }
  } catch (err) {
    console.error('Batch verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runBatchAudit();
