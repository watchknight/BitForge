import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function run() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  await page.goto('https://dkton.at/', { waitUntil: 'networkidle2' });
  
  const box = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => (e.innerText || '').trim() === 'ENTER THE EXPERIENCE');
    if (!target) return null;
    const r = target.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (box) {
    await page.mouse.click(box.x, box.y);
    await new Promise(r => setTimeout(r, 2000));
    
    // Scroll 1
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_deep1.png' });

    // Scroll 2
    await page.evaluate(() => window.scrollBy(0, 1500));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_deep2.png' });

    // Scroll 3
    await page.evaluate(() => window.scrollBy(0, 1500));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/dkton_deep3.png' });
  }
  await browser.close();
  console.log('Captured dkton deep screens');
}
run().catch(console.error);
