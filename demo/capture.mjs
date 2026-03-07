#!/usr/bin/env node

/**
 * Captures a sequence of screenshots from the running readme-builder app,
 * then stitches them into an animated GIF using ffmpeg.
 *
 * Prerequisites:
 *   npm install --no-save playwright
 *   Dev server running: npm run dev
 *   ffmpeg installed
 *
 * Usage:
 *   node demo/capture.mjs [--fps 0.65] [--width 960]
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const FRAMES_DIR = join(PROJECT_ROOT, 'demo', '.frames');
const OUTPUT = join(PROJECT_ROOT, 'assets', 'demo.gif');

const args = process.argv.slice(2);
const fps = parseFloat(args[args.indexOf('--fps') + 1] || '0.65');
const gifWidth = parseInt(args[args.indexOf('--width') + 1] || '960', 10);

const WIDTH = 1280;
const HEIGHT = 720;
const BASE = process.env.DEMO_URL || 'http://localhost:5173/readme-builder/';

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

  // --- Demo script: edit these scenes to match your app ---

  await snap(page, 'Default template loaded', 300);

  // Select and edit the title block
  const blocks = page.locator('.space-y-1\\.5 > div');
  await blocks.nth(0).click();
  await snap(page, 'Title block selected, editor opens');

  const editor = page.locator('.border-t.border-gray-700.bg-gray-900');
  const ta = editor.locator('textarea').first();
  await ta.fill('# React Query Toolkit\n\nTyped hooks for React Query with zero boilerplate');
  await snap(page, 'Edited project title and subtitle');

  // Select another block
  await blocks.nth(4).click();
  await snap(page, 'Selected Features heading block');

  // Markdown view
  await page.locator('button:has-text("Markdown")').click();
  await snap(page, 'Markdown source view', 800);

  await page.locator('button:has-text("Visual")').click();
  await snap(page, 'Back to visual editor');

  // Templates modal
  await page.locator('button:has-text("Templates")').click();
  await snap(page, 'Templates modal open', 800);

  await page.locator('text=CLI Tool').first().click();
  await snap(page, 'Applied CLI Tool template', 800);

  // Scroll preview to show GitShow card
  const previewPanel = page.locator('.flex-1.overflow-y-auto').last();
  await previewPanel.evaluate(el => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }));
  await snap(page, 'Preview: author section with GitShow card', 1200);

  // Scroll blocks and show GitShow editor
  const blockList = page.locator('.overflow-y-auto').first();
  await blockList.evaluate(el => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }));
  await page.waitForTimeout(400);
  const allBlocks = page.locator('.space-y-1\\.5 > div');
  const count = await allBlocks.count();
  await allBlocks.nth(count - 3).click();
  await snap(page, 'Editing GitShow card', 700);

  // Social links editor
  await allBlocks.nth(count - 2).click();
  await snap(page, 'Editing Social Links', 700);

  // Light mode toggle
  const lightToggle = page.locator('button[title="Switch to light mode"]');
  if (await lightToggle.count() > 0) {
    await lightToggle.click();
    await snap(page, 'Light mode preview', 800);
  }

  // Final state
  await previewPanel.evaluate(el => el.scrollTo({ top: 0, behavior: 'smooth' }));
  await blockList.evaluate(el => el.scrollTo({ top: 0, behavior: 'smooth' }));
  await snap(page, 'Final view - light mode', 800);

  // --- End of scenes ---

  console.log(`\n${frameNum} frames captured`);
  await browser.close();

  // Stitch into GIF
  console.log(`\nCreating GIF at ${fps} fps, ${gifWidth}px wide...`);
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

  const { statSync } = await import('fs');
  const size = (statSync(OUTPUT).size / 1024).toFixed(0);
  console.log(`\n${OUTPUT} (${size} KB)`);

  // Clean up frames
  rmSync(FRAMES_DIR, { recursive: true, force: true });
  console.log('Cleaned up intermediate frames');
}

main().catch(err => { console.error(err); process.exit(1); });
