import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const BASE_URL = 'http://127.0.0.1:4173';
const SCREENSHOT_DIR = 'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const BREAKPOINTS = [
  { name: '360px (Small Phone)', width: 360, height: 740 },
  { name: '390px (iPhone 12/13/14)', width: 390, height: 844 },
  { name: '430px (iPhone Pro Max)', width: 430, height: 932 },
  { name: '768px (iPad Portrait)', width: 768, height: 1024 },
  { name: '1024px (iPad Landscape)', width: 1024, height: 768 },
];

const PAGES_TO_TEST = [
  { name: 'Landing Page', hash: '' },
  { name: 'Roadmap Page', hash: '#roadmap' },
  { name: 'Array Topic (Merge Sort)', hash: '#topic/merge-sort' },
  { name: 'Tree Topic (Binary Search Tree)', hash: '#topic/binary-search-tree' },
  { name: 'Graph Topic (BFS)', hash: '#topic/breadth-first-search' },
  { name: 'Grid Topic (Knapsack DP)', hash: '#topic/knapsack-dp' },
  { name: 'Linked List Topic (SLL)', hash: '#topic/singly-linked-list' },
  { name: 'Quiz Hub', hash: '#quiz-hub' },
  { name: 'Race Mode', hash: '#race' },
];

async function runBreakpointAudit() {
  console.log('===============================================================');
  console.log('  BITFORGE COMPREHENSIVE MOBILE BREAKPOINT AUDIT (STEP 1)');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });

  const page = await browser.newPage();

  // Setup bypass for intro gate
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => sessionStorage.setItem('bitforge_experience_entered', 'true'));

  const auditResults = [];

  for (const bp of BREAKPOINTS) {
    console.log(`\n================== BREAKPOINT: ${bp.name} (${bp.width}x${bp.height}) ==================`);
    await page.setViewport({ width: bp.width, height: bp.height });

    for (const targetPage of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}/${targetPage.hash}`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 600));

      const pageMetrics = await page.evaluate((bpWidth) => {
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const innerWidth = window.innerWidth;
        const hasHorizontalScroll = scrollWidth > innerWidth + 1 || bodyScrollWidth > innerWidth + 1;

        // Find elements causing horizontal overflow if any
        const overflowingElements = [];
        const allElements = Array.from(document.querySelectorAll('*'));
        
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > innerWidth + 1 && rect.width > 0) {
            overflowingElements.push({
              tag: el.tagName,
              id: el.id,
              className: (typeof el.className === 'string' ? el.className : '').slice(0, 100),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              overflowPx: Math.round(rect.right - innerWidth),
            });
          }
        }

        // Check simulation canvas/container dimensions if on a topic page
        const simCanvas = document.querySelector('svg') || document.querySelector('canvas');
        const codePanel = document.querySelector('pre') || document.querySelector('.font-mono');
        const playbackControls = document.querySelector('[class*="PlaybackControls"]') || 
          document.querySelector('button[aria-label*="Play"]') || 
          document.querySelector('button title');

        return {
          scrollWidth,
          innerWidth,
          hasHorizontalScroll,
          overflowDelta: Math.max(0, scrollWidth - innerWidth),
          overflowingElements: overflowingElements.slice(0, 5), // top 5
        };
      }, bp.width);

      const status = pageMetrics.hasHorizontalScroll ? 'FAIL (Horizontal Overflow)' : 'PASS';
      console.log(`[${status}] ${targetPage.name.padEnd(32)} | scrollWidth: ${pageMetrics.scrollWidth}px vs innerWidth: ${bp.width}px (Delta: +${pageMetrics.overflowDelta}px)`);

      if (pageMetrics.hasHorizontalScroll && pageMetrics.overflowingElements.length > 0) {
        console.log(`       Top overflowing elements:`, pageMetrics.overflowingElements.map(e => `${e.tag}.${e.className.slice(0, 30)} (+${e.overflowPx}px)`).join(', '));
      }

      // Capture screenshots for 360px and 768px for visual evidence
      if (bp.width === 360 || bp.width === 768) {
        const safeName = `${bp.width}px_${targetPage.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/audit_${safeName}.png`,
          fullPage: false,
        });
      }

      auditResults.push({
        breakpoint: bp.name,
        width: bp.width,
        page: targetPage.name,
        ...pageMetrics,
      });
    }
  }

  await browser.close();
  console.log('\n===============================================================');
  console.log('  MOBILE BREAKPOINT AUDIT COMPLETE');
  console.log('===============================================================');

  // Save audit log summary
  fs.writeFileSync(
    'C:/Users/Moayed/.gemini/antigravity/brain/fb424ed0-5bd6-45a9-aacd-1d06ec0479f2/scratch/mobile_audit_results.json',
    JSON.stringify(auditResults, null, 2)
  );
}

runBreakpointAudit().catch(err => {
  console.error('Audit execution failed:', err);
  process.exit(1);
});
