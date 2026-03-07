---
name: capture-demo-gif
description: Capture an animated demo GIF of a web application using Playwright screenshots and ffmpeg. Use when creating a demo GIF for a README, when the user asks to record or capture a web app demo, or when a project needs a visual demo for documentation.
---

# Capture Demo GIF for a Web App

Record a scripted walkthrough of a web application as an animated GIF for README embedding. Uses headless Playwright for screenshots and ffmpeg for GIF encoding.

## Prerequisites

- Node.js 20+
- ffmpeg installed (`brew install ffmpeg`)
- Dev server running for the target app

## Workflow

### 1. Plan the Demo Scenes

Before writing code, decide which interactions to show. A good demo GIF has 8-15 frames covering:

- Initial state (app loaded)
- 2-3 key interactions (click, type, navigate)
- A result/output state
- Total duration: 15-25 seconds

### 2. Write the Capture Script

Create a file at `<project>/demo/capture.mjs`:

```javascript
import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, rmSync, statSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const FRAMES_DIR = join(PROJECT_ROOT, 'demo', '.frames');
const OUTPUT = join(PROJECT_ROOT, 'assets', 'demo.gif');

const fps = 0.65;       // ~1.5s per frame
const gifWidth = 960;   // output width in px
const WIDTH = 1280;     // viewport width
const HEIGHT = 720;     // viewport height
const BASE = process.env.DEMO_URL || 'http://localhost:5173/';

let frameNum = 0;
async function snap(page, label, ms = 600) {
  await page.waitForTimeout(ms);
  frameNum++;
  const f = `frame_${String(frameNum).padStart(2, '0')}.png`;
  await page.screenshot({ path: join(FRAMES_DIR, f), type: 'png' });
  console.log(`  [${f}] ${label}`);
}

async function main() {
  mkdirSync(FRAMES_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
  })).newPage();

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // --- SCENES: customize per project ---
  await snap(page, 'Initial state', 300);
  // Add interactions here: page.click(), page.fill(), page.locator()...
  // --- END SCENES ---

  console.log(`\n${frameNum} frames captured`);
  await browser.close();

  // Stitch into GIF
  const filter = [
    `scale=${gifWidth}:-1:flags=lanczos`,
    'split[s0][s1]',
    '[s0]palettegen=max_colors=128:stats_mode=diff[p]',
    '[s1][p]paletteuse=dither=bayer:bayer_scale=3',
  ].join(',');

  execSync(
    `ffmpeg -y -framerate ${fps} -i "${join(FRAMES_DIR, 'frame_%02d.png')}" -vf "${filter}" "${OUTPUT}"`,
    { stdio: 'inherit' },
  );

  const size = (statSync(OUTPUT).size / 1024).toFixed(0);
  console.log(`\n${OUTPUT} (${size} KB)`);

  rmSync(FRAMES_DIR, { recursive: true, force: true });
}

main().catch(err => { console.error(err); process.exit(1); });
```

### 3. Key Settings

| Setting | Default | Notes |
|---------|---------|-------|
| `deviceScaleFactor` | `2` | Retina-quality screenshots. Use `1` for smaller files |
| `fps` | `0.65` | Frames per second in GIF. Lower = longer per frame. `0.5` = 2s/frame, `1` = 1s/frame |
| `gifWidth` | `960` | Output GIF width. Source is 1280×720 at 2× DPR |
| `max_colors` | `128` | GIF palette size. Lower = smaller file, worse gradients |
| Viewport | `1280×720` | Standard 720p. Don't go smaller or UI elements get cramped |

### 4. Common Playwright Actions for Demos

```javascript
// Click by text
await page.locator('button:has-text("Save")').click();

// Click nth element in a list
await page.locator('.item-list > div').nth(2).click();

// Type into input
const input = page.locator('input[placeholder="Search"]');
await input.fill('hello world');

// Scroll to bottom
const panel = page.locator('.scrollable-area');
await panel.evaluate(el => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }));

// Wait for animation/transition
await page.waitForTimeout(800);

// Toggle a button
await page.locator('button[title="Dark mode"]').click();
```

### 5. Install, Run, Embed

```bash
# Install playwright (don't save to package.json)
cd <project>
npm install --no-save playwright

# Start dev server in another terminal, then:
node demo/capture.mjs
```

Add to `.gitignore`:
```
demo/.frames
```

Embed in README:
```markdown
![Demo](assets/demo.gif)
```

### 6. Troubleshooting

**GIF too large (>2MB)?**
- Reduce `gifWidth` to `640`
- Increase `fps` (fewer seconds = fewer unique frames needed)
- Reduce `max_colors` to `64`
- Remove frames that don't add value

**Screenshots blank/wrong?**
- Increase `waitForTimeout` before first `snap()` -- app may not be fully rendered
- Check if the dev server URL is correct (some apps use a base path)
- Try `headless: false` to see what Playwright sees

**Selectors not matching?**
- Use `page.locator('text=Visible Text')` for the most robust selectors
- Use `await page.pause()` with `headless: false` to inspect the DOM
- Avoid CSS class selectors that include Tailwind hashes

## When NOT to Use This

- **Terminal/CLI tools** → Use the `render-remotion-animation` skill with the CliDemo template instead
- **Library code demos** → Use `render-remotion-animation` with CodeBeforeAfter template
- **Interactive web apps with drag-drop, live preview, UI flows** → Use this skill
