<h1 align="center">readme-builder</h1>

<p align="center">
  <strong>Stop writing markdown by hand. Drag blocks, get a README.</strong>
</p>

<p align="center">
  Visual editor that turns drag-and-drop blocks into GitHub-flavored markdown.<br>
  Live preview, templates, import from GitHub repos, export when you're done.
</p>

<p align="center">
  <a href="https://ofershap.github.io/readme-builder"><img src="https://img.shields.io/badge/Try_It_Now-22c55e?style=for-the-badge&logoColor=white" alt="Try It Now" /></a>
  &nbsp;
  <a href="#features"><img src="https://img.shields.io/badge/Features-3b82f6?style=for-the-badge&logoColor=white" alt="Features" /></a>
  &nbsp;
  <a href="#self-hosting"><img src="https://img.shields.io/badge/Self_Host-8b5cf6?style=for-the-badge&logoColor=white" alt="Self Host" /></a>
</p>

<p align="center">
  <a href="https://github.com/ofershap/readme-builder/stargazers"><img src="https://img.shields.io/github/stars/ofershap/readme-builder?style=social" alt="GitHub stars" /></a>
  &nbsp;
  <a href="https://github.com/ofershap/readme-builder/actions/workflows/ci.yml"><img src="https://github.com/ofershap/readme-builder/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-strict-blue" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
</p>

---

## Your README Shouldn't Take Longer Than Your Code

You just built something cool. Now you need a README, and suddenly you're juggling markdown syntax, badge URLs, table alignment, and GitHub-flavored quirks. You know the drill:

- Copy-paste badge URLs from shields.io, typo the repo name, debug for 10 minutes
- Manually align tables, forget a pipe character, the whole thing breaks
- Check how the markdown renders by pushing to GitHub and refreshing

README Builder gives you a visual canvas where you drag blocks (headings, badges, code, tables, images, alerts) into place and see exactly how GitHub will render them. When it looks right, copy the markdown or export the file. Done.

![Screenshot](assets/screenshot.png)

## Features

| | |
|---|---|
| **15 block types** | Headings, badges, code, tables, lists, images, alerts, details/spoilers, blockquotes, horizontal rules, and more |
| **Live preview** | GitHub-flavored rendering updates as you type, including GFM alerts and tables |
| **Drag and drop** | Reorder blocks visually with `@dnd-kit` |
| **Badge editor** | Visual badge builder with color swatches, logo picker (30+ icons), live/static toggle |
| **Import** | Paste raw markdown, pick a file from your computer, or fetch any GitHub repo's README |
| **Templates** | Start from "Minimal Library" or "Full Project" templates, or build from scratch |
| **Undo/Redo** | Full history with `Cmd+Z` / `Cmd+Shift+Z` |
| **Auto-save** | Blocks persist in localStorage across sessions |
| **Markdown tab** | Switch to raw markdown view with syntax highlighting (CodeMirror) |
| **Dark/Light preview** | Toggle preview theme to match GitHub dark or light mode |
| **Export** | Download as `.md` file with your chosen filename |

## Tech Stack

| | |
|---|---|
| **Framework** | ![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white) |
| **Styling** | ![Tailwind](https://img.shields.io/badge/Tailwind_4-06B6D4?logo=tailwindcss&logoColor=white) |
| **Build** | ![Vite](https://img.shields.io/badge/Vite_7-646CFF?logo=vite&logoColor=white) |
| **State** | ![Zustand](https://img.shields.io/badge/Zustand_5-433E38) + zundo (time travel) |
| **Editor** | ![CodeMirror](https://img.shields.io/badge/CodeMirror_6-D30707) |
| **Drag & Drop** | @dnd-kit/react |
| **Markdown** | react-markdown + remark-gfm + rehype-raw |

## Self-Hosting

The app is fully client-side. No backend, no auth, no tracking. Clone and run:

```bash
git clone https://github.com/ofershap/readme-builder.git
cd readme-builder
npm install
npm run dev
```

Open `http://localhost:5173`. That's it.

For production, build and serve the static files from anywhere:

```bash
npm run build
npx serve dist
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |
| `Cmd+Shift+C` | Copy markdown to clipboard |
| `Delete` / `Backspace` | Remove selected block |

## Contributing

Contributions welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Author

[![Made by ofershap](https://gitshow.dev/api/card/ofershap)](https://gitshow.dev/ofershap)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/ofershap)

---

If this helped you, [star the repo](https://github.com/ofershap/readme-builder), [open an issue](https://github.com/ofershap/readme-builder/issues) if something breaks, or [start a discussion](https://github.com/ofershap/readme-builder/discussions).

## License

[MIT](LICENSE) &copy; [Ofer Shapira](https://github.com/ofershap)
