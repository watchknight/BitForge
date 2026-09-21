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

const topics = ['binary-search-tree', 'merge-sort', 'breadth-first-search', 'knapsack-dp', 'singly-linked-list'];
for (const t of topics) {
  await page.goto('http://127.0.0.1:4173/#topic/' + t);
  await new Promise(r => setTimeout(r, 600));
  const simCard = await page.$('.min-h-\\[360px\\]');
  if (simCard) {
    await simCard.screenshot({ path: 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots/audit_card_360px_' + t + '.png' });
    console.log('Saved card screenshot for ' + t);
  } else {
    console.log('Could not find card for ' + t);
  }
}
await browser.close();
