# Demo GIF Generation

Automated script that captures screenshots of the running app using Playwright, then stitches them into an animated GIF with ffmpeg.

## Prerequisites

- Node.js 20+
- ffmpeg installed (`brew install ffmpeg`)
- Dev server running (`npm run dev` in project root)

## Usage

```bash
# Install playwright (not saved to package.json)
npm install --no-save playwright

# Start dev server in another terminal
npm run dev

# Generate the GIF
node demo/capture.mjs
```

### Options

```bash
# Custom frame rate (seconds per frame = 1/fps)
node demo/capture.mjs --fps 0.5    # 2s per frame, slower
node demo/capture.mjs --fps 1      # 1s per frame, faster

# Custom output width
node demo/capture.mjs --width 640  # smaller file size
```

## Editing the demo

The demo script is in `capture.mjs`. Each "scene" is a `snap()` call preceded by a Playwright action. To change what the demo shows:

1. Edit the scenes between the `--- Demo script ---` markers
2. Use standard Playwright selectors to interact with the app
3. `snap(page, 'description', delayMs)` captures a frame after waiting

## Output

The GIF is saved to `assets/demo.gif` and referenced from the project README.
