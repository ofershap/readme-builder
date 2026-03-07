# readme-builder

Visual drag-and-drop README editor. React 19 + TypeScript strict + Tailwind 4 + Vite 7.

## Architecture

```
src/
  store.ts          — Zustand store with zundo (undo/redo). Blocks array + markdown string.
  types.ts          — Block, BlockType, all props interfaces
  blocks/
    registry.ts     — BLOCK_DEFINITIONS: type, label, icon, defaultProps
    markdown.ts     — blockToMarkdown(): Block → GitHub-flavored markdown string
    parser.ts       — parseMarkdown(): markdown string → Block[] (for import)
  components/
    Canvas.tsx      — Sortable block list + editor panel (35% / 65% split)
    BlockEditor.tsx — Per-block-type editor forms (one function per type)
    BlockPalette.tsx— Sidebar icon palette for adding blocks
    Preview.tsx     — react-markdown with remark-gfm + rehype-raw
    Toolbar.tsx     — Top bar: tabs, undo/redo, templates, import/export/copy
    TemplateModal.tsx — 4 starter templates
    MarkdownTab.tsx — CodeMirror readonly markdown view
```

## Block lifecycle

1. User clicks palette icon → `addBlock(type)` → new Block with `defaultProps` from registry
2. Block appears in Canvas list, user clicks to select → editor opens below
3. User edits props → `updateBlock(id, props)` → store recalculates markdown
4. Preview re-renders from markdown string

## Key constraints

- All state in single Zustand store, temporal middleware tracks history
- Blocks persist to localStorage on every change
- Markdown generation is synchronous, called on every block mutation
- Import parser converts markdown AST back to Block[] (lossy for unsupported node types)
- No backend, no auth, no tracking — fully client-side
