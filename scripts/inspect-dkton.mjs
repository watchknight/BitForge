import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox'],
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  await page.goto('https://dkton.at/', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('ENTER THE EXPERIENCE'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_entered.png' });
  
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_scroll1.png' });

  await page.evaluate(() => window.scrollBy(0, 1200));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_scroll2.png' });

  await browser.close();
  console.log('Done capturing dkton screens');
}
run().catch(console.error);
