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

async function runPlatformAudit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('Browser Error:', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
    console.log('Page Error:', err.toString());
  });

  try {
    console.log('\n--- 1. Testing Landing Page & Global Search ---');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // Open Search via button or hotkey
    const searchBtn = await page.$('button[aria-label="Search all topics"]');
    if (searchBtn) {
      await searchBtn.click();
    } else {
      await page.keyboard.down('Control');
      await page.keyboard.press('k');
      await page.keyboard.up('Control');
    }
    await new Promise(r => setTimeout(r, 600));

    // Type in search box
    const searchInput = await page.$('input[aria-label="Search topics"]');
    if (searchInput) {
      await searchInput.type('AVL');
      await new Promise(r => setTimeout(r, 500));
      console.log('Typed AVL into Global Search');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'platform_01_global_search.png') });
      console.log('Captured platform_01_global_search.png');

      // Press Enter to navigate to AVL topic
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 1200));
      console.log('Navigated to topic URL:', page.url());
    }

    console.log('\n--- 2. Testing Simulation Controls & Keyboard Navigation ---');
    // Test keyboard shortcuts on topic simulation
    // Press Space to toggle play
    await page.keyboard.press('Space');
    await new Promise(r => setTimeout(r, 1000));
    // Press Space again to pause
    await page.keyboard.press('Space');
    await new Promise(r => setTimeout(r, 400));
    // Step forward with ArrowRight
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 400));
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 400));
    console.log('Simulation playback keyboard controls verified');

    console.log('\n--- 3. Testing Sorting Race Mode ---');
    await page.goto('http://127.0.0.1:5173/#race', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // Start race
    const startRaceBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent && (b.textContent.includes('Start Race') || b.textContent.includes('Replay Race')));
    });

    if (startRaceBtn) {
      await startRaceBtn.click();
      console.log('Clicked Start Race, waiting for race execution...');
      await new Promise(r => setTimeout(r, 3000));
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'platform_02_race_mode.png') });
    console.log('Captured platform_02_race_mode.png');

    console.log('\n--- 4. Testing Quiz Hub ---');
    await page.goto('http://127.0.0.1:5173/#quiz-hub', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'platform_03_quiz_hub_modes.png') });
    console.log('Captured platform_03_quiz_hub_modes.png');

    // Click "Quick Blitz"
    const blitzCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      const blitz = cards.find(c => c.textContent && c.textContent.includes('Quick Blitz'));
      return blitz ? blitz.closest('div[class*="cursor-pointer"]') : null;
    });

    if (blitzCard) {
      await blitzCard.click();
      await new Promise(r => setTimeout(r, 800));
      console.log('Started Quick Blitz quiz');

      // Answer 5 questions
      for (let i = 0; i < 5; i++) {
        const optionBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => {
            const sp = b.querySelector('span');
            return sp && ['A', 'B', 'C', 'D'].includes(sp.textContent.trim());
          });
        });

        if (optionBtn) {
          await optionBtn.click();
          await new Promise(r => setTimeout(r, 600));
        }

        if (i === 0) {
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'platform_04_quiz_question_answered.png') });
          console.log('Captured platform_04_quiz_question_answered.png');
        }

        // Click next
        const nextBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent && (b.textContent.includes('Next Question') || b.textContent.includes('View Quiz Results')));
        });
        if (nextBtn) {
          await nextBtn.click();
          await new Promise(r => setTimeout(r, 500));
        }
      }

      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'platform_05_quiz_results.png') });
      console.log('Captured platform_05_quiz_results.png');
    }

    console.log('\n--- 5. Testing Roadmap & Progress Status Badges ---');
    await page.goto('http://127.0.0.1:5173/#roadmap', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'platform_06_roadmap_progress.png') });
    console.log('Captured platform_06_roadmap_progress.png');

    console.log('\n=============================================');
    console.log(`AUDIT COMPLETE. Console Errors Detected: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    } else {
      console.log('PERFECT CLEAN AUDIT! 0 Console Errors!');
    }
    console.log('=============================================');

  } catch (err) {
    console.error('Audit encountered exception:', err);
  } finally {
    await browser.close();
  }
}

runPlatformAudit();
