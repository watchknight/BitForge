import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function run() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  await page.goto('https://dkton.at/', { waitUntil: 'networkidle2' });
  
  // Click the enter button
  await page.click('.button_main_element');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_post_enter.png' });

  // Scroll
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_post_scroll1.png' });

  await page.evaluate(() => window.scrollBy(0, 1500));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_post_scroll2.png' });

  await browser.close();
  console.log('Captured dkton post enter');
}
run().catch(console.error);
