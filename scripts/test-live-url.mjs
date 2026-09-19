import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';

async function testLiveUrl() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  try {
    // Localtunnel bypass header
    await page.setExtraHTTPHeaders({
      'Bypass-Tunnel-Reminder': 'true',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
    });

    console.log('Navigating directly with Bypass-Tunnel-Reminder header...');
    await page.goto('https://rich-ghosts-pump.loca.lt', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    console.log('Page title on live URL:', await page.title());
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'platform_07_live_tunnel_deployed.png') });
    console.log('Successfully captured platform_07_live_tunnel_deployed.png from live public URL!');
  } catch (err) {
    console.error('Error during live test:', err);
  } finally {
    await browser.close();
  }
}

testLiveUrl();
