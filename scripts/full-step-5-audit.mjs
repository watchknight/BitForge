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

const FLAGSHIP_TOPIC_IDS = [
  'merge-sort',
  'singly-linked-list',
  'binary-search-tree',
  'graph-bfs',
  'knapsack-dp',
];

async function runAudit() {
  console.log('=== Step 5 Exhaustive Verification: 1440px & 1920px Layout Pass ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // Helper to bypass intro gate
  async function initSession() {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluate(() => {
      sessionStorage.setItem('bitforge_experience_entered', 'true');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
  }

  await initSession();

  const issuesFound = [];

  // ==========================================
  // 1. AUDIT ROADMAP PAGE (ALL 11 STAGES)
  // ==========================================
  for (const vp of [{ w: 1440, h: 900, name: '1440px' }, { w: 1920, h: 1080, name: '1920px' }]) {
    console.log(`\n>>> Auditing Roadmap Page at ${vp.name} (${vp.w}x${vp.h})`);
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    const stagesAudit = await page.evaluate(() => {
      const stageContainers = document.querySelectorAll('.space-y-8 > .rounded-2xl');
      const results = [];

      stageContainers.forEach((stage, idx) => {
        const titleEl = stage.querySelector('h2');
        const title = titleEl?.textContent?.trim() || `Stage ${idx + 1}`;
        const stageNumEl = stage.querySelector('.font-mono.text-slate-500');
        const stageOrder = stageNumEl?.textContent?.trim() || `Stage ${idx + 1}`;

        const grid = stage.querySelector('.grid');
        if (!grid) return;

        const cards = Array.from(grid.children);
        const gridRect = grid.getBoundingClientRect();

        const cardMetrics = cards.map((c) => {
          const r = c.getBoundingClientRect();
          return {
            width: Math.round(r.width),
            left: Math.round(r.left),
            right: Math.round(r.right),
            top: Math.round(r.top),
          };
        });

        // Calculate gaps between cards on the same visual row
        const rowGaps = [];
        for (let i = 0; i < cardMetrics.length - 1; i++) {
          const curr = cardMetrics[i];
          const next = cardMetrics[i + 1];
          // If on same vertical row (within 10px top)
          if (Math.abs(curr.top - next.top) < 10) {
            rowGaps.push(next.left - curr.right);
          }
        }

        const isCentered = cards.length <= 2
          ? Math.abs((gridRect.left + gridRect.width / 2) - ((cardMetrics[0].left + cardMetrics[cardMetrics.length - 1].right) / 2)) < 8
          : false;

        results.push({
          stageOrder,
          title,
          cardCount: cards.length,
          gridWidth: Math.round(gridRect.width),
          cardWidths: cardMetrics.map((c) => c.width),
          rowGaps,
          isCentered,
          hasAbnormalGap: rowGaps.some((g) => g > 25), // normal gap is 14px (gap-3.5)
          isDistortedWide: cardMetrics.some((c) => c.width > 700),
        });
      });

      return results;
    });

    console.table(stagesAudit.map((s) => ({
      Stage: s.stageOrder,
      Cards: s.cardCount,
      'Grid W': s.gridWidth,
      'Card W': s.cardWidths[0],
      Gaps: s.rowGaps.join(', ') || 'N/A',
      Centered: s.isCentered,
      AbnormalGap: s.hasAbnormalGap,
      Distorted: s.isDistortedWide,
    })));

    stagesAudit.forEach((s) => {
      if (s.hasAbnormalGap) {
        issuesFound.push(`[${vp.name}] ${s.stageOrder} (${s.title}): Abnormal gap between cards: ${s.rowGaps.join(', ')}px`);
      }
      if (s.isDistortedWide) {
        issuesFound.push(`[${vp.name}] ${s.stageOrder} (${s.title}): Card width exceeds 700px: ${s.cardWidths.join(', ')}px`);
      }
    });

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/step5_roadmap_audit_${vp.name}.png`,
      fullPage: false,
    });
    console.log(`✓ Saved screenshot step5_roadmap_audit_${vp.name}.png`);
  }

  // ==========================================
  // 2. AUDIT LANDING PAGE
  // ==========================================
  for (const vp of [{ w: 1440, h: 900, name: '1440px' }, { w: 1920, h: 1080, name: '1920px' }]) {
    console.log(`\n>>> Auditing Landing Page at ${vp.name}`);
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    const landingAudit = await page.evaluate(() => {
      const hero = document.querySelector('section');
      const pillars = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
      const flagships = document.querySelector('section:has(.grid.justify-center)');
      const flagshipGrid = flagships?.querySelector('.grid');
      const flagshipCards = flagshipGrid ? Array.from(flagshipGrid.children) : [];

      return {
        heroWidth: hero?.clientWidth,
        pillarsWidth: pillars?.clientWidth,
        flagshipCount: flagshipCards.length,
        flagshipWidths: flagshipCards.map((c) => c.clientWidth),
      };
    });
    console.log(`Landing Audit (${vp.name}):`, landingAudit);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/step5_landing_audit_${vp.name}.png`,
      fullPage: false,
    });
    console.log(`✓ Saved screenshot step5_landing_audit_${vp.name}.png`);
  }

  // ==========================================
  // 3. AUDIT QUIZ HUB
  // ==========================================
  for (const vp of [{ w: 1440, h: 900, name: '1440px' }, { w: 1920, h: 1080, name: '1920px' }]) {
    console.log(`\n>>> Auditing Quiz Hub at ${vp.name}`);
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto(`${BASE_URL}/#quiz-hub`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    const quizAudit = await page.evaluate(() => {
      const container = document.querySelector('.space-y-8');
      const modeGrid = container?.querySelector('.grid');
      const modeCards = modeGrid ? Array.from(modeGrid.children) : [];

      return {
        containerWidth: container?.clientWidth,
        modeCount: modeCards.length,
        modeWidths: modeCards.map((c) => c.clientWidth),
      };
    });
    console.log(`Quiz Hub Audit (${vp.name}):`, quizAudit);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/step5_quiz_hub_audit_${vp.name}.png`,
      fullPage: false,
    });
    console.log(`✓ Saved screenshot step5_quiz_hub_audit_${vp.name}.png`);
  }

  // ==========================================
  // 4. AUDIT EVERY FLAGSHIP SIMULATION PAGE
  // ==========================================
  for (const topicId of FLAGSHIP_TOPIC_IDS) {
    for (const vp of [{ w: 1440, h: 900, name: '1440px' }, { w: 1920, h: 1080, name: '1920px' }]) {
      console.log(`\n>>> Auditing Flagship [${topicId}] at ${vp.name}`);
      await page.setViewport({ width: vp.w, height: vp.h });
      await page.goto(`${BASE_URL}/#topic/${topicId}`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 600));

      const topicAudit = await page.evaluate(() => {
        const container = document.querySelector('.space-y-10');
        const visualCanvas = document.querySelector('.min-h-\\[360px\\]');
        const codePanel = document.querySelector('.lg\\:col-span-5');
        const controls = document.querySelector('.p-4.bg-obsidian-900\\/90');

        return {
          containerWidth: container?.clientWidth,
          canvasWidth: visualCanvas?.clientWidth,
          codePanelWidth: codePanel?.clientWidth,
          hasOverflow: document.body.scrollWidth > window.innerWidth,
        };
      });

      console.log(`Flagship [${topicId}] (${vp.name}):`, topicAudit);

      if (topicAudit.hasOverflow) {
        issuesFound.push(`[${vp.name}] Flagship [${topicId}]: Document body horizontal overflow detected!`);
      }

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/step5_flagship_${topicId}_${vp.name}.png`,
        fullPage: false,
      });
      console.log(`✓ Saved screenshot step5_flagship_${topicId}_${vp.name}.png`);
    }
  }

  await browser.close();

  console.log('\n==========================================');
  console.log('STEP 5 AUDIT SUMMARY REPORT:');
  console.log('Total Issues Found:', issuesFound.length);
  if (issuesFound.length > 0) {
    console.log('Issues List:');
    issuesFound.forEach((i) => console.log(' - ' + i));
  } else {
    console.log('ALL CHECKS PASSED WITH 0 DEFECTS!');
  }
  console.log('==========================================\n');
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
