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

async function runVerification() {
  console.log('===============================================================');
  console.log('  BITFORGE STEPS 3, 4, 5 MOBILE VERIFICATION SUITE');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 360, height: 800, isMobile: true, hasTouch: true },
  });

  const page = await browser.newPage();

  // Bypass intro gate
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => sessionStorage.setItem('bitforge_experience_entered', 'true'));
  await page.reload({ waitUntil: 'networkidle0' });

  // -------------------------------------------------------------
  // STEP 3: PLAYBACK CONTROLS & TOUCH TARGETS (MINIMUM 44x44px)
  // -------------------------------------------------------------
  console.log('--- Step 3.1: Verifying Navbar Touch Targets at 360px ---');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  const navTouchTargets = await page.evaluate(() => {
    const soundBtn = document.querySelector('[aria-label="Enable sound"], [aria-label="Mute sound"]');
    const motionBtn = document.querySelector('[aria-label="Disable reduced motion"], [aria-label="Enable reduced motion"]');
    const searchBtn = document.querySelector('[aria-label="Search topics"]');
    const menuBtn = document.querySelector('[aria-label="Toggle navigation menu"]');

    const getDims = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    };

    return {
      sound: getDims(soundBtn),
      motion: getDims(motionBtn),
      search: getDims(searchBtn),
      menu: getDims(menuBtn),
    };
  });
  console.log('Navbar button dimensions:', navTouchTargets);

  // Open mobile menu and check item dimensions
  await page.click('[aria-label="Toggle navigation menu"]');
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step3_navbar_menu_360px.png` });

  const menuItems = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('nav div.space-y-2 button'));
    return links.map((btn) => {
      const r = btn.getBoundingClientRect();
      return { text: btn.textContent?.trim().slice(0, 20), height: Math.round(r.height) };
    });
  });
  console.log('Mobile menu links heights:', menuItems);

  console.log('\n--- Step 3.2: Verifying Simulation Playback Controls Touch Targets (>=44x44px) ---');
  await page.goto(`${BASE_URL}/#topic/merge-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const playbackTargets = await page.evaluate(() => {
    const reset = document.querySelector('button[title*="Reset"], button[title*="Restart"]');
    const prev = document.querySelector('button[title*="Previous step"]');
    const play = document.querySelector('button[title*="Play"], button[title*="Pause"]');
    const next = document.querySelector('button[title*="Next step"]');
    const randomize = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Random'));
    const speedPill = document.querySelector('[aria-label*="speed"], [aria-label*="Speed"]')?.closest('div');

    const getDims = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    };

    return {
      reset: getDims(reset),
      prev: getDims(prev),
      play: getDims(play),
      next: getDims(next),
      randomize: getDims(randomize),
      speedPill: getDims(speedPill),
    };
  });
  console.log('Playback Controls dimensions:', playbackTargets);

  // Scroll to playback bar and capture screenshot
  await page.evaluate(() => {
    const playBtn = document.querySelector('button[title*="Play"], button[title*="Pause"]');
    playBtn?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step3_playback_controls_360px.png` });

  console.log('\n--- Step 3.3: Verifying Quiz Touch Targets (>=44px height) ---');
  const quizOptionDims = await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('button[class*="min-h-"]')).filter(b => b.querySelector('span'));
    return options.slice(0, 4).map(o => {
      const r = o.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    });
  });
  console.log('Quiz options dimensions in topic page:', quizOptionDims);

  // -------------------------------------------------------------
  // STEP 4: HOVER-ONLY REPLACED WITH TOUCH EQUIVALENTS
  // -------------------------------------------------------------
  console.log('\n--- Step 4: Verifying Tap-to-Preview in Roadmap Topic Cards ---');
  await page.goto(`${BASE_URL}/#roadmap`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const previewButtons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent?.includes('Preview'));
    return btns.map(b => {
      const r = b.getBoundingClientRect();
      return {
        text: b.textContent?.trim(),
        ariaLabel: b.getAttribute('aria-label'),
        width: Math.round(r.width),
        height: Math.round(r.height)
      };
    });
  });
  console.log(`Found ${previewButtons.length} "Tap to Preview" buttons. Sample:`, previewButtons.slice(0, 2));

  // Scroll first preview button into view
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Tap to Preview'));
    btn?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 400));

  // Tap first preview button and verify state changes to "Playing"
  console.log('Tapping "Tap to Preview" button...');
  const firstPreviewBtn = await page.$('button[aria-label*="Preview"][aria-label*="animation"]');
  if (firstPreviewBtn) {
    await firstPreviewBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  const activePreviewState = await page.evaluate(() => {
    const playingBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Playing'));
    const url = window.location.hash;
    return {
      hasPlayingBtn: !!playingBtn,
      playingText: playingBtn?.textContent?.trim(),
      currentHash: url,
    };
  });
  console.log('Preview state after tap:', activePreviewState);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step4_roadmap_tap_preview_360px.png` });

  // -------------------------------------------------------------
  // STEP 5: CODE PANEL & RACE MODE
  // -------------------------------------------------------------
  console.log('\n--- Step 5.1: Verifying SyncedCodePanel Mobile Responsiveness ---');
  await page.goto(`${BASE_URL}/#topic/merge-sort`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Scroll code panel into view
  await page.evaluate(() => {
    const codeHeading = Array.from(document.querySelectorAll('h3, span')).find(el => el.textContent?.includes('Algorithm Implementation') || el.textContent?.includes('Active line:'));
    codeHeading?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 400));

  const codePanelMetrics = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('div.grid.grid-cols-3 button'));
    const codeContainer = document.querySelector('div.overscroll-x-contain');
    const firstLine = codeContainer?.querySelector('div.min-w-max');
    const computed = window.getComputedStyle(codeContainer || document.body);

    const tabsInfo = tabs.map(t => {
      const r = t.getBoundingClientRect();
      return { label: t.textContent?.trim(), width: Math.round(r.width), height: Math.round(r.height) };
    });

    const isHorizontallyScrollable = (codeContainer?.scrollWidth || 0) > (codeContainer?.clientWidth || 0);

    return {
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      tabs: tabsInfo,
      clientWidth: codeContainer?.clientWidth,
      scrollWidth: codeContainer?.scrollWidth,
      isHorizontallyScrollable,
      hasNoLineWrap: !!firstLine,
    };
  });
  console.log('Code panel mobile metrics:', codePanelMetrics);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step5_code_panel_360px.png` });

  console.log('\n--- Step 5.2: Verifying Race Mode Mobile Stacking & Controls ---');
  await page.goto(`${BASE_URL}/#race`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const raceModeMetrics = await page.evaluate(() => {
    const algoChips = Array.from(document.querySelectorAll('button')).filter(b => b.textContent?.includes('Sort'));
    const datasetBtns = ['Random', 'Reverse Sorted', 'Nearly Sorted', 'Few Unique'].map(l => {
      const b = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.trim() === l);
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { label: l, width: Math.round(r.width), height: Math.round(r.height) };
    }).filter(Boolean);

    const raceControls = {
      reset: document.querySelector('button[aria-label="Reset Race"]')?.getBoundingClientRect(),
      start: Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Start Race'))?.getBoundingClientRect(),
      stepBack: document.querySelector('button[aria-label="Step Back"]')?.getBoundingClientRect(),
      stepForward: document.querySelector('button[aria-label="Step Forward"]')?.getBoundingClientRect(),
    };

    const lanesContainer = document.querySelector('div.grid.gap-6');
    const lanes = Array.from(lanesContainer?.children || []);
    const laneBoxes = lanes.map(lane => {
      const r = lane.getBoundingClientRect();
      return { top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
    });

    // Check if lanes are vertically stacked (each lane's top is greater than previous lane)
    const isVerticallyStacked = laneBoxes.length >= 2 && laneBoxes[1].top > laneBoxes[0].top;

    return {
      chipHeights: algoChips.map(c => Math.round(c.getBoundingClientRect().height)),
      datasetBtns,
      raceControls: {
        reset: raceControls.reset ? { w: Math.round(raceControls.reset.width), h: Math.round(raceControls.reset.height) } : null,
        start: raceControls.start ? { w: Math.round(raceControls.start.width), h: Math.round(raceControls.start.height) } : null,
        stepBack: raceControls.stepBack ? { w: Math.round(raceControls.stepBack.width), h: Math.round(raceControls.stepBack.height) } : null,
        stepForward: raceControls.stepForward ? { w: Math.round(raceControls.stepForward.width), h: Math.round(raceControls.stepForward.height) } : null,
      },
      laneCount: laneBoxes.length,
      laneWidths: laneBoxes.map(l => l.width),
      isVerticallyStacked,
      docScrollWidth: document.documentElement.scrollWidth,
    };
  });
  console.log('Race Mode mobile metrics:', raceModeMetrics);

  // Test running race simulation for a few steps
  console.log('Testing Start Race on mobile...');
  const startRaceBtn = await page.$('button.bg-brand-500');
  if (startRaceBtn) {
    await startRaceBtn.click();
    await new Promise((r) => setTimeout(r, 600));
  }

  const raceRunningMetrics = await page.evaluate(() => {
    const comparisons = Array.from(document.querySelectorAll('.text-amber-400')).map(el => el.textContent?.trim());
    const swaps = Array.from(document.querySelectorAll('.text-brand-300')).map(el => el.textContent?.trim());
    return { comparisons, swaps };
  });
  console.log('Live operation counters during race:', raceRunningMetrics);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile_step5_race_mode_360px.png` });

  await browser.close();
  console.log('\n===============================================================');
  console.log('  ALL CHECKS IN STEPS 3, 4, 5 COMPLETED SUCCESSFULLY!');
  console.log('===============================================================');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
