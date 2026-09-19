import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function run() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://dkton.at/', { waitUntil: 'networkidle2' });
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button, [role=button], div')).filter(e => {
      const txt = (e.innerText || e.textContent || '').trim();
      return txt === 'ENTER THE EXPERIENCE';
    }).map(e => ({
      tag: e.tagName,
      className: e.className,
      rect: e.getBoundingClientRect()
    }));
  });
  console.log('ENTER button candidates:', JSON.stringify(buttons, null, 2));
  await browser.close();
}
run().catch(console.error);
