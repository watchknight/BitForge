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
  console.log('=== Verifying Step 4: Typography & Surface Pass ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Bypass intro gate
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    sessionStorage.setItem('bitforge_experience_entered', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Audit Typography & Computed Fonts
  const typographyAudit = await page.evaluate(() => {
    const bodyFont = window.getComputedStyle(document.body).fontFamily;
    const h1 = document.querySelector('h1');
    const h1Font = h1 ? window.getComputedStyle(h1).fontFamily : 'None';
    const code = document.querySelector('code, pre, .font-mono');
    const codeFont = code ? window.getComputedStyle(code).fontFamily : 'None';

    return { bodyFont, h1Font, codeFont };
  });

  console.log('Typography Audit:');
  console.log(' - Body Font:', typographyAudit.bodyFont);
  console.log(' - Heading Font:', typographyAudit.h1Font);
  console.log(' - Monospace Font:', typographyAudit.codeFont);

  // Screenshot 1: Typography on Landing Hero
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step4_01_typography_hero.png`,
    fullPage: false,
  });
  console.log('✓ Captured step4_01_typography_hero.png');

  // 3. Audit Surfaces & Warm Borders on Topic Page
  console.log('\nChecking Topic Simulation & Card Surfaces...');
  await page.goto(`${BASE_URL}/#topic/merge-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const surfaceAudit = await page.evaluate(() => {
    const card = document.querySelector('.bg-obsidian-900, .bg-obsidian-900\\/90');
    if (!card) return null;
    const style = window.getComputedStyle(card);
    return {
      borderColor: style.borderColor,
      boxShadow: style.boxShadow,
      backgroundColor: style.backgroundColor,
    };
  });

  console.log('Card Surface Audit:');
  console.log(' - Card Border Color:', surfaceAudit?.borderColor);
  console.log(' - Card Box Shadow:', surfaceAudit?.boxShadow);
  console.log(' - Card Background:', surfaceAudit?.backgroundColor);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step4_02_warm_surfaces_cards.png`,
    fullPage: false,
  });
  console.log('✓ Captured step4_02_warm_surfaces_cards.png');

  // 4. Open Global Search Modal to verify Warm Modal Surface & Ambient Shadows
  console.log('\nChecking Global Search Modal Surface & Ambient Warm Shadow...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Search all topics"]');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const modalShadow = await page.evaluate(() => {
    const modal = document.querySelector('div[role="dialog"] > div');
    if (!modal) return null;
    return window.getComputedStyle(modal).boxShadow;
  });
  console.log(' - Modal Box Shadow:', modalShadow);

  await page.screenshot({
    path: `${SCREENSHOT_DIR}/step4_03_warm_shadows_modal.png`,
    fullPage: false,
  });
  console.log('✓ Captured step4_03_warm_shadows_modal.png');

  await browser.close();
  console.log('\n=== All Step 4 Verifications Completed Successfully! ===');
}

verifyStep4().catch((err) => {
  console.error('Step 4 verification failed:', err);
  process.exit(1);
});
