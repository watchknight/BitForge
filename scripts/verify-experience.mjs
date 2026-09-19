import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';

async function auditExperience() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
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
    console.log('\n--- 1. Testing Cinematic Experience Intro Gate (dkton.at style) ---');
    // Clear sessionStorage so gate displays
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluate(() => sessionStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'experience_01_intro_gate.png') });
    console.log('Captured experience_01_intro_gate.png');

    console.log('\n--- 2. Entering Experience & Verifying Constellation Mesh (boonglobal.io style) ---');
    // Click "Enter Experience // With Sound"
    const enterBtn = await page.evaluateHandle(() => {
      const all = Array.from(document.querySelectorAll('button'));
      return all.find(b => b.textContent && b.textContent.includes('Enter Experience'));
    });
    if (enterBtn) {
      await enterBtn.click();
    }
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'experience_02_hero_constellation.png') });
    console.log('Captured experience_02_hero_constellation.png');

    console.log('\n--- 3. Verifying Audio Equalizer in Navbar ---');
    // Check equalizer state
    const soundBtnText = await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Sound"], button[title*="Mute"]');
      return btn ? btn.textContent : null;
    });
    console.log('Sound Equalizer Button State:', soundBtnText);
    await page.screenshot({ 
      path: path.join(SCREENSHOT_DIR, 'experience_03_navbar_equalizer.png'),
      clip: { x: 0, y: 0, width: 1440, height: 120 }
    });
    console.log('Captured experience_03_navbar_equalizer.png');

    console.log('\n--- 4. Verifying Spotlight Cards & Architectural Crosshairs ---');
    await page.evaluate(() => window.scrollBy({ top: 1200, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 1200));

    // Hover over first spotlight card
    await page.hover('.grid .relative.overflow-hidden').catch(() => {});
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'experience_04_spotlight_cards.png') });
    console.log('Captured experience_04_spotlight_cards.png');

    console.log('\n--- 5. Verifying Simulation Playback Sonification on Topic Page ---');
    await page.goto('http://127.0.0.1:5173/#topic/merge-sort', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // Step forward 3 times
    const stepFwdBtn = await page.evaluateHandle(() => {
      return document.querySelector('button[title*="Next Step"]');
    });
    if (stepFwdBtn) {
      await stepFwdBtn.click();
      await new Promise(r => setTimeout(r, 300));
      await stepFwdBtn.click();
      await new Promise(r => setTimeout(r, 300));
      await stepFwdBtn.click();
    }
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'experience_05_simulation_sound_playback.png') });
    console.log('Captured experience_05_simulation_sound_playback.png');

    console.log('\n--- Verification Audit Complete ---');
    console.log(`Total Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await browser.close();
  }
}

auditExperience();
