import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';

async function auditMotionAndDesign() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('Console Error:', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
    console.log('Page Error:', err.toString());
  });

  try {
    console.log('\n--- 1. Testing Hero Staggered Typography Reveal ---');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200)); // allow staggered reveal to complete
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'design_01_staggered_hero.png') });
    console.log('Captured design_01_staggered_hero.png');

    console.log('\n--- 2. Testing ScrollSentenceBuilder (Boon Global Technique) ---');
    // Scroll down to sentence builder
    await page.evaluate(() => {
      const el = document.querySelector('section:has(h2)');
      window.scrollBy({ top: 750, behavior: 'smooth' });
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'design_02_sentence_builder_step1.png') });
    console.log('Captured design_02_sentence_builder_step1.png');

    // Click step 3
    const step3 = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      return cards.find(c => c.textContent && c.textContent.includes('surgical precision'));
    });
    if (step3) {
      await step3.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'design_03_sentence_builder_step3.png') });
      console.log('Captured design_03_sentence_builder_step3.png');
    }

    console.log('\n--- 3. Testing Section Breather Pacing Moment ---');
    await page.evaluate(() => {
      window.scrollBy({ top: 1200, behavior: 'smooth' });
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'design_04_section_breather.png') });
    console.log('Captured design_04_section_breather.png');

    console.log('\n--- 4. Testing Roadmap Structured Credits & Hover Micro-Previews ---');
    await page.goto('http://127.0.0.1:5173/#roadmap', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // Hover over the first topic card
    const firstCard = await page.$('div[class*="group p-4 rounded-xl"]');
    if (firstCard) {
      await firstCard.hover();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'design_05_roadmap_card_hover.png') });
      console.log('Captured design_05_roadmap_card_hover.png');
    }

    // Scroll to bottom of Roadmap to verify Section Breather
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'design_06_roadmap_breather.png') });
    console.log('Captured design_06_roadmap_breather.png');

    console.log('\n======================================================');
    console.log(`DESIGN AUDIT COMPLETE. Console Errors Detected: ${consoleErrors.length}`);
    if (consoleErrors.length === 0) {
      console.log('PERFECT! Zero console errors during all motion sequences!');
    } else {
      console.log('Errors:', consoleErrors);
    }
    console.log('======================================================');

  } catch (err) {
    console.error('Audit exception:', err);
  } finally {
    await browser.close();
  }
}

auditMotionAndDesign();
