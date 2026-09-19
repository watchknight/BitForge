import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Test against production preview server
const BASE_URL = 'http://127.0.0.1:4173';

async function runFullQAAudit() {
  console.log('=== Starting BitForge Full Platform-Wide QA Audit (Prod Preview) ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('  [Console Error]:', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
    console.log('  [Page Error]:', err.toString());
  });

  try {
    // 0. Bypass intro gate for deterministic QA
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluate(() => {
      sessionStorage.setItem('bitforge_experience_entered', 'true');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    // --- TEST 1: Progress Tracking on Roadmap ---
    console.log('✓ Test 1: Testing Progress Tracking (Not Started -> Practicing -> Mastered)');
    await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // Scroll to first stage and open status dropdown on first topic card
    await page.waitForSelector('button[title*="mastery status"]', { visible: true });
    await page.click('button[title*="mastery status"]');
    console.log('  Clicked status badge to open dropdown');
    await new Promise((r) => setTimeout(r, 400));

    // Click "mastered" option inside the popup
    await page.waitForSelector('[data-testid="set-status-mastered"]', { visible: true });
    await page.click('[data-testid="set-status-mastered"]');
    console.log('  Selected "mastered" in popup');
    await new Promise((r) => setTimeout(r, 600));

    // Verify localStorage has updated
    const storedProgress = await page.evaluate(() => {
      return localStorage.getItem('bitforge_user_progress_v2');
    });
    console.log('  Persisted in localStorage:', !!storedProgress);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa_01_roadmap_progress_tracked.png'),
    });
    console.log('  Captured qa_01_roadmap_progress_tracked.png\n');

    // --- TEST 2: Global Search Across Topics ---
    console.log('✓ Test 2: Testing Global Search (Cmd+K / Search Dialog)');
    // Click desktop search button
    const searchOpened = await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Ctrl+K"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('  Opened search modal:', searchOpened);
    await new Promise((r) => setTimeout(r, 600));

    // Type query
    await page.waitForSelector('input[placeholder*="Search algorithms"]', { visible: true });
    await page.type('input[placeholder*="Search algorithms"]', 'binary');
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa_02_global_search_results.png'),
    });
    console.log('  Captured qa_02_global_search_results.png');

    // Cleanly close the search modal with Escape
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));
    console.log('  Closed search modal.\n');

    // --- TEST 3: Race Mode (Side-by-Side Sorting) ---
    console.log('✓ Test 3: Testing Race Mode (Sorting Category)');
    await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // Start Race
    const raceStarted = await page.evaluate(() => {
      const startBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && (b.textContent.includes('Start Race') || b.textContent.includes('Play'))
      );
      if (startBtn) {
        startBtn.click();
        return true;
      }
      return false;
    });
    console.log('  Race playback started:', raceStarted);
    // Let race run for 2.5 seconds to advance counters
    await new Promise((r) => setTimeout(r, 2500));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa_03_race_mode_in_action.png'),
    });
    console.log('  Captured qa_03_race_mode_in_action.png\n');

    // --- TEST 4: Quiz Hub ---
    console.log('✓ Test 4: Testing Quiz Hub (Questions, Feedback, Scoring)');
    await page.goto(`${BASE_URL}/#quiz-hub`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Start Quick Blitz Mode (5 questions) using data-testid selector
    await page.waitForSelector('[data-testid="quiz-blitz-card"]', { visible: true });
    await page.click('[data-testid="quiz-blitz-card"]');
    console.log('  Quick Blitz quiz card clicked');
    await new Promise((r) => setTimeout(r, 1000));

    // Wait for question options to appear and click first option
    await page.waitForSelector('[data-testid="quiz-option-0"]', { visible: true });
    await page.click('[data-testid="quiz-option-0"]');
    console.log('  Question option clicked: true');
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa_04_quiz_question_answered.png'),
    });
    console.log('  Captured qa_04_quiz_question_answered.png\n');

    // --- TEST 5: Accessibility Pass & Keyboard Navigation ---
    console.log('✓ Test 5: Testing Accessibility Pass (Reduced Motion & ARIA)');
    // Toggle reduced motion button
    await page.click('button[aria-label*="reduced motion"], button[title*="Reduced Motion"]');
    await new Promise((r) => setTimeout(r, 400));

    const reducedActive = await page.evaluate(() => {
      return document.documentElement.classList.contains('reduced-motion');
    });
    console.log('  Reduced motion active in DOM:', reducedActive);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa_05_accessibility_reduced_motion.png'),
    });
    console.log('  Captured qa_05_accessibility_reduced_motion.png\n');

    // --- TEST 6: Performance & Topic Simulation Navigation ---
    console.log('✓ Test 6: Testing Simulation Stepping & Multi-Language Code Sync');
    await page.goto(`${BASE_URL}/#topic/quick-sort`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Step forward twice
    const stepped = await page.evaluate(() => {
      const nextBtn = document.querySelector('button[aria-label="Next step"], button[title*="Next Step"]');
      if (nextBtn) {
        nextBtn.click();
        return true;
      }
      return false;
    });
    console.log('  Stepped forward once:', stepped);
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const nextBtn = document.querySelector('button[aria-label="Next step"], button[title*="Next Step"]');
      if (nextBtn) nextBtn.click();
    });
    console.log('  Stepped forward twice');
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa_06_quick_sort_step_sync.png'),
    });
    console.log('  Captured qa_06_quick_sort_step_sync.png\n');

    console.log('=== Full Platform-Wide QA Audit Completed ===');
    console.log(`Total Unhandled Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors caught:', consoleErrors);
    }
  } catch (err) {
    console.error('Audit execution error:', err);
  } finally {
    await browser.close();
  }
}

runFullQAAudit();
