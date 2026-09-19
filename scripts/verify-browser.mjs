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

async function runAudit() {
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
    console.log('--- 1. Testing Landing Page ---');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_landing_page.png') });

    // Verify title and hero elements
    const title = await page.title();
    console.log('Page Title:', title);

    // Helper to click by text
    async function clickByText(tag, text) {
      return page.evaluate((tag, text) => {
        const elements = Array.from(document.querySelectorAll(tag));
        const match = elements.find((el) => el.textContent.includes(text));
        if (match) {
          match.click();
          return true;
        }
        return false;
      }, tag, text);
    }

    // Helper to wait for text
    async function waitForText(text) {
      await page.waitForFunction(
        (t) => document.body.innerText.includes(t),
        { timeout: 8000 },
        text
      );
    }

    // Test Hero Randomize Array button
    console.log('Testing hero randomize button...');
    const clickedRand = await clickByText('button', 'Randomize Array');
    console.log('Clicked randomize array:', clickedRand);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    // --- 2. Testing Roadmap Page ---
    console.log('--- 2. Testing Roadmap Page ---');
    await page.goto('http://127.0.0.1:5173/#roadmap', { waitUntil: 'networkidle0' });
    await waitForText('DSA Mastery Roadmap');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_roadmap_page.png') });

    // Test search on roadmap
    console.log('Testing roadmap search filter...');
    const searchInput = await page.waitForSelector('input[placeholder*="Search algorithms"]', { timeout: 4000 });
    if (searchInput) {
      await searchInput.type('Merge');
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
      await searchInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
    }

    // --- 3. Testing Big-O Cheat Sheet Page ---
    console.log('--- 3. Testing Big-O Cheat Sheet Page ---');
    await page.goto('http://127.0.0.1:5173/#big-o', { waitUntil: 'networkidle0' });
    await waitForText('Big-O Complexity Cheat Sheet');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_big_o_page.png') });

    // --- 4. Testing About Page ---
    console.log('--- 4. Testing About Page ---');
    await page.goto('http://127.0.0.1:5173/#about', { waitUntil: 'networkidle0' });
    await waitForText('Demystifying DSA for Visual Thinkers');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_about_page.png') });

    // --- 5. Testing Flagship 1: Merge Sort ---
    console.log('--- 5. Testing Flagship 1: Merge Sort ---');
    await page.goto('http://127.0.0.1:5173/#topic/merge-sort', { waitUntil: 'networkidle0' });
    await waitForText('Merge Sort');

    // Verify Playback controls: Step forward
    console.log('Exercising Merge Sort step forward...');
    const nextBtn = await page.waitForSelector('button[title="Next Step"]', { timeout: 4000 });
    if (nextBtn) {
      await nextBtn.click();
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
      await nextBtn.click();
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
      await nextBtn.click();
    }

    // Verify synced code panel: switch to C++
    console.log('Toggling code language to C++...');
    await clickByText('button', 'C++');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));

    // Verify custom input
    console.log('Testing custom input dialog on Merge Sort...');
    const customBtn = await page.waitForSelector('button[title="Enter Custom Input"]', { timeout: 4000 });
    if (customBtn) {
      await customBtn.click();
      await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
      await clickByText('button', 'Cancel');
      await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
    }

    // Scroll to simulator
    await page.evaluate(() => {
      const el = document.querySelector('h2');
      if (el) el.scrollIntoView();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_merge_sort_simulation.png') });

    // Test quiz interaction
    console.log('Testing practice quiz on Merge Sort...');
    await clickByText('button', 'O(N log N)');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    // --- 6. Testing Flagship 2: Singly Linked List ---
    console.log('--- 6. Testing Flagship 2: Singly Linked List ---');
    await page.goto('http://127.0.0.1:5173/#topic/singly-linked-list', { waitUntil: 'networkidle0' });
    await waitForText('Singly Linked List');

    // Test switching operation to Insert Head
    console.log('Testing Linked List insert operation...');
    await clickByText('button', 'Insert Head');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));

    // Step forward
    const llNextBtn = await page.waitForSelector('button[title="Next Step"]', { timeout: 4000 });
    if (llNextBtn) {
      await llNextBtn.click();
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
      await llNextBtn.click();
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
    }

    await page.evaluate(() => {
      const el = document.querySelector('h2');
      if (el) el.scrollIntoView();
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_linked_list_simulation.png') });

    // --- 7. Testing Flagship 3: Binary Search Tree ---
    console.log('--- 7. Testing Flagship 3: Binary Search Tree ---');
    await page.goto('http://127.0.0.1:5173/#topic/binary-search-tree', { waitUntil: 'networkidle0' });
    await waitForText('Binary Search Tree');

    // Step forward through BST
    console.log('Stepping through BST insertion and in-order traversal...');
    const bstNextBtn = await page.waitForSelector('button[title="Next Step"]', { timeout: 4000 });
    if (bstNextBtn) {
      for (let i = 0; i < 4; i++) {
        await bstNextBtn.click();
        await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
      }
    }

    await page.evaluate(() => {
      const el = document.querySelector('h2');
      if (el) el.scrollIntoView();
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_bst_simulation.png') });

    // --- 8. Testing Flagship 4: Breadth-First Search ---
    console.log('--- 8. Testing Flagship 4: Breadth-First Search ---');
    await page.goto('http://127.0.0.1:5173/#topic/breadth-first-search', { waitUntil: 'networkidle0' });
    await waitForText('Breadth-First Search');

    // Step forward through BFS
    console.log('Stepping through BFS queue additions...');
    const bfsNextBtn = await page.waitForSelector('button[title="Next Step"]', { timeout: 4000 });
    if (bfsNextBtn) {
      for (let i = 0; i < 4; i++) {
        await bfsNextBtn.click();
        await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
      }
    }

    await page.evaluate(() => {
      const el = document.querySelector('h2');
      if (el) el.scrollIntoView();
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_bfs_simulation.png') });

    // --- 9. Testing Flagship 5: Fibonacci DP Tabulation ---
    console.log('--- 9. Testing Flagship 5: Fibonacci DP Tabulation ---');
    await page.goto('http://127.0.0.1:5173/#topic/fibonacci-dp', { waitUntil: 'networkidle0' });
    await waitForText('Fibonacci via DP Tabulation');

    // Step through Fibonacci DP cells
    console.log('Stepping through Fibonacci DP table cells...');
    const fibNextBtn = await page.waitForSelector('button[title="Next Step"]', { timeout: 4000 });
    if (fibNextBtn) {
      for (let i = 0; i < 4; i++) {
        await fibNextBtn.click();
        await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
      }
    }

    await page.evaluate(() => {
      const el = document.querySelector('h2');
      if (el) el.scrollIntoView();
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_fibonacci_dp_simulation.png') });

    console.log('========================================');
    console.log('Total Console Errors Encountered:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error('Errors:', consoleErrors);
      process.exit(1);
    } else {
      console.log('SUCCESS: All 5 flagship topics and pages verified with 0 console errors!');
    }
  } catch (error) {
    console.error('Audit failed with error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAudit();
