import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ 
  executablePath: CHROME_PATH, 
  headless: true, 
  defaultViewport: { width: 360, height: 800 } 
});
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4173/');
await page.evaluate(() => sessionStorage.setItem('bitforge_experience_entered', 'true'));
await page.goto('http://127.0.0.1:4173/#topic/binary-search-tree', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 600));

const res = await page.evaluate(() => {
  const btn = document.querySelector('[aria-label="Zoom in"]');
  const span = btn?.parentElement?.querySelector('span');
  const textBefore = span?.textContent;
  if (btn) btn.click();
  return {
    btnFound: !!btn,
    textBefore,
  };
});
await new Promise(r => setTimeout(r, 100));
const textAfter = await page.evaluate(() => {
  const btn = document.querySelector('[aria-label="Zoom in"]');
  return btn?.parentElement?.querySelector('span')?.textContent;
});
console.log('Result:', res, 'After click:', textAfter);
await browser.close();
