import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const TOPICS = [
  'bubble-sort', 'selection-sort', 'insertion-sort', 'quick-sort',
  'heap-sort', 'counting-sort', 'radix-sort', 'linear-search',
  'binary-search', 'ternary-search', 'doubly-linked-list', 'stack',
  'queue', 'circular-queue', 'priority-queue', 'circular-linked-list',
  'deque', 'recursion-basics', 'n-queens', 'maze-path',
  'subsets-backtracking', 'avl-tree', 'binary-heap', 'trie',
  'segment-tree', 'fenwick-tree', 'hash-map', 'depth-first-search',
  'dijkstra', 'knapsack-dp', 'lcs-dp', 'interval-scheduling',
  'disjoint-set', 'topological-sort', 'coin-change', 'huffman-coding',
  'kmp-search', 'bit-manipulation', 'merge-sort', 'singly-linked-list',
  'binary-search-tree', 'breadth-first-search', 'fibonacci-dp'
];

const STATIC_PAGES = ['landing', 'roadmap', 'race', 'quiz-hub', 'big-o', 'about'];

const auditReport = {
  consoleErrors: [],
  consoleWarnings: [],
  pageErrors: [],
  networkFailures: [],
  layoutOverflows: [],
  simulationFailures: [],
  persistenceIssues: [],
};

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set intro gate as entered
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });

  // Track console events
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    // Ignore harmless Vite HMR or browser favicon logs
    if (text.includes('[vite]') || text.includes('downloadable font') || text.includes('AudioContext')) return;
    if (type === 'error') {
      auditReport.consoleErrors.push({ url: page.url(), text });
    } else if (type === 'warn') {
      auditReport.consoleWarnings.push({ url: page.url(), text });
    }
  });

  page.on('pageerror', (err) => {
    auditReport.pageErrors.push({ url: page.url(), message: err.message, stack: err.stack });
  });

  page.on('requestfailed', (req) => {
    // Ignore favicon or analytics
    if (req.url().includes('favicon') || req.url().includes('google-analytics')) return;
    auditReport.networkFailures.push({ url: req.url(), errorText: req.failure()?.errorText });
  });

  console.log('--- AUDITING STATIC PAGES ---');
  for (const p of STATIC_PAGES) {
    const url = p === 'landing' ? 'http://127.0.0.1:4173/' : `http://127.0.0.1:4173/#${p}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
      await new Promise((r) => setTimeout(r, 400));

      // Test overflow at breakpoints
      const viewports = [360, 768, 1440, 1920];
      for (const w of viewports) {
        await page.setViewport({ width: w, height: 900 });
        await new Promise((r) => setTimeout(r, 100));
        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            bodyScrollWidth: document.body.scrollWidth,
            isOverflow: document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth
          };
        });
        if (overflow.isOverflow) {
          auditReport.layoutOverflows.push({
            page: p,
            viewport: `${w}px`,
            scrollWidth: overflow.scrollWidth,
            clientWidth: overflow.clientWidth,
            bodyScrollWidth: overflow.bodyScrollWidth,
          });
        }
      }
    } catch (err) {
      auditReport.pageErrors.push({ url, message: `Navigation failed: ${err.message}` });
    }
  }

  console.log('--- AUDITING TOPIC SIMULATION PAGES ---');
  for (const topicId of TOPICS) {
    const url = `http://127.0.0.1:4173/#topic/${topicId}`;
    try {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
      await new Promise((r) => setTimeout(r, 300));

      // Check simulation status on the topic page
      const simStatus = await page.evaluate(() => {
        // Look for step counter or error element
        const bodyText = document.body.innerText;
        const hasStepText = /Step \d+ \/ \d+/i.test(bodyText) || /Step: \d+/i.test(bodyText);
        const hasZeroSteps = /Step 0 \/ 0/i.test(bodyText);
        const hasError = bodyText.includes('Simulation Error') || bodyText.includes('TypeError');
        
        // Find play/pause button
        const playBtn = document.querySelector('button[aria-label*="play" i], button[aria-label*="pause" i], button[title*="Play" i], button[title*="Pause" i]');
        const stepBtn = document.querySelector('button[aria-label*="step" i], button[title*="Next" i], button[title*="Step" i]');
        
        return {
          hasStepText,
          hasZeroSteps,
          hasError,
          hasPlayBtn: !!playBtn,
          hasStepBtn: !!stepBtn,
        };
      });

      if (simStatus.hasZeroSteps) {
        auditReport.simulationFailures.push({ topicId, issue: 'Simulation generated 0 steps (Step 0 / 0)' });
      }
      if (simStatus.hasError) {
        auditReport.simulationFailures.push({ topicId, issue: 'Page displayed error text' });
      }

      // Test mobile overflow at 360px
      await page.setViewport({ width: 360, height: 800 });
      await new Promise((r) => setTimeout(r, 100));
      const mobileOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth;
      });
      if (mobileOverflow) {
        auditReport.layoutOverflows.push({ page: `topic/${topicId}`, viewport: '360px', issue: 'Horizontal overflow on mobile' });
      }
    } catch (err) {
      auditReport.pageErrors.push({ url, message: `Topic page audit failed: ${err.message}` });
    }
  }

  console.log('--- AUDITING PERSISTENCE (THEME & PROGRESS) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });

  // Test theme persistence
  const themeBefore = await page.evaluate(() => localStorage.getItem('bitforge_theme'));
  const themeBtn = await page.$('button[aria-label*="light mode"], button[aria-label*="dark mode"]');
  if (themeBtn) {
    await themeBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    const themeAfterToggle = await page.evaluate(() => localStorage.getItem('bitforge_theme'));
    // Reload page
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 300));
    const themeAfterReload = await page.evaluate(() => {
      return {
        storageTheme: localStorage.getItem('bitforge_theme'),
        hasLightClass: document.documentElement.classList.contains('light'),
        hasDarkClass: document.documentElement.classList.contains('dark'),
      };
    });

    if (themeAfterToggle === themeBefore) {
      auditReport.persistenceIssues.push({ issue: 'Theme did not change in localStorage on toggle' });
    }
    if (themeAfterReload.storageTheme !== themeAfterToggle) {
      auditReport.persistenceIssues.push({ issue: 'Theme in localStorage was not preserved after page reload' });
    }
    if (themeAfterToggle === 'light' && !themeAfterReload.hasLightClass) {
      auditReport.persistenceIssues.push({ issue: 'HTML element did not have .light class after reload when theme is light' });
    }
    // Toggle back to dark
    const themeBtn2 = await page.$('button[aria-label*="light mode"], button[aria-label*="dark mode"]');
    if (themeBtn2) await themeBtn2.click();
  } else {
    auditReport.persistenceIssues.push({ issue: 'Could not find theme toggle button' });
  }

  // Test sound persistence
  const soundBtn = await page.$('button[aria-label*="mute" i], button[aria-label*="sound" i]');
  if (soundBtn) {
    await soundBtn.click();
    await new Promise((r) => setTimeout(r, 200));
    const soundState = await page.evaluate(() => localStorage.getItem('bitforge_sound_enabled'));
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 200));
    const soundStateAfterReload = await page.evaluate(() => localStorage.getItem('bitforge_sound_enabled'));
    if (soundState !== soundStateAfterReload) {
      auditReport.persistenceIssues.push({ issue: 'Sound enabled preference did not persist after reload' });
    }
  }

  await browser.close();

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Page Errors: ${auditReport.pageErrors.length}`);
  console.log(`Console Errors: ${auditReport.consoleErrors.length}`);
  console.log(`Console Warnings: ${auditReport.consoleWarnings.length}`);
  console.log(`Layout Overflows: ${auditReport.layoutOverflows.length}`);
  console.log(`Simulation Failures: ${auditReport.simulationFailures.length}`);
  console.log(`Persistence Issues: ${auditReport.persistenceIssues.length}`);
  console.log(`Network Failures: ${auditReport.networkFailures.length}`);
  console.log('================================================\n');

  fs.writeFileSync(
    'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/scratch/browser-audit-raw.json',
    JSON.stringify(auditReport, null, 2)
  );
  console.log('Saved browser-audit-raw.json');
}

run();
