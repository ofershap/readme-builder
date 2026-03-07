import { create } from 'zustand';
import { temporal } from 'zundo';
import type { Block, BlockType, BlockProps } from './types';
import { BLOCK_DEFINITIONS } from './blocks/registry';
import { generateMarkdown } from './blocks/markdown';

let nextId = Date.now();
const genId = () => `block-${nextId++}`;

interface ReadmeStore {
  blocks: Block[];
  selectedBlockId: string | null;
  activeTab: 'visual' | 'markdown';
  markdown: string;
  fileName: string;

  addBlock: (type: BlockType, index?: number) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, props: Partial<BlockProps>) => void;
  selectBlock: (id: string | null) => void;
  setTab: (tab: 'visual' | 'markdown') => void;
  duplicateBlock: (id: string) => void;
  setBlocks: (blocks: Block[]) => void;
  setFileName: (name: string) => void;
  resetToDefault: () => void;
}

const DEFAULT_BLOCKS: Block[] = [
  { id: genId(), type: 'centered', props: { content: '# My Awesome Project\n\nA fast, lightweight tool for doing amazing things.' } },
  { id: genId(), type: 'badges', props: { badges: [
    { id: 'b1', label: 'npm version', message: '', color: 'red', style: 'flat' as const, logo: 'npm', preset: 'https://img.shields.io/npm/v/my-package' },
    { id: 'b2', label: 'CI', message: 'passing', color: 'brightgreen', style: 'flat' as const, logo: 'githubactions' },
    { id: 'b3', label: 'TypeScript', message: 'strict', color: '3178C6', style: 'flat' as const, logo: 'typescript', logoColor: 'white' },
    { id: 'b4', label: 'License', message: 'MIT', color: 'yellow', style: 'flat' as const },
  ], align: 'center' } },
  { id: genId(), type: 'paragraph', props: { text: '> **Zero dependencies** -- under 2KB gzipped. Works in Node.js 18+ and all modern browsers.' } },
  { id: genId(), type: 'image', props: { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=300&fit=crop&crop=top', alt: 'Demo screenshot showing the main interface with live preview', align: 'center', width: '600' } },
  { id: genId(), type: 'heading', props: { level: 2, text: 'Features' } },
  { id: genId(), type: 'list', props: { style: 'unordered' as const, items: [
    { text: '**Blazing fast** -- optimized with zero allocations in hot paths' },
    { text: '**Type-safe** -- full TypeScript support with strict mode' },
    { text: '**Tree-shakeable** -- only import what you need' },
    { text: '**Well tested** -- 100% code coverage' },
  ] } },
  { id: genId(), type: 'heading', props: { level: 2, text: 'Installation' } },
  { id: genId(), type: 'code', props: { language: 'bash', code: 'npm install my-awesome-project' } },
  { id: genId(), type: 'heading', props: { level: 2, text: 'Quick Start' } },
  { id: genId(), type: 'code', props: { language: 'typescript', code: "import { createApp } from 'my-awesome-project';\n\nconst app = createApp({\n  debug: true,\n  output: './dist',\n});\n\nconst result = await app.run();\nconsole.log(result); // { success: true, files: 42 }" } },
  { id: genId(), type: 'heading', props: { level: 2, text: 'API Reference' } },
  { id: genId(), type: 'table', props: { headers: ['Option', 'Type', 'Default', 'Description'], rows: [
    ['debug', 'boolean', 'false', 'Enable verbose logging'],
    ['output', 'string', './dist', 'Output directory path'],
    ['workers', 'number', 'os.cpus()', 'Parallel worker count'],
    ['timeout', 'number', '30000', 'Operation timeout in ms'],
  ] } },
  { id: genId(), type: 'details', props: { summary: 'Advanced Configuration', content: 'You can customize the behavior with a config file:\n\n```json\n{\n  "extends": "default",\n  "plugins": ["plugin-a", "plugin-b"],\n  "rules": {\n    "max-depth": 3\n  }\n}\n```\n\nPlace this as `.myprojectrc` in your project root.', open: false } },
  { id: genId(), type: 'alert', props: { type: 'TIP' as const, text: 'You can also use environment variables for configuration. Set `MY_PROJECT_DEBUG=1` to enable debug mode without changing code.' } },
  { id: genId(), type: 'heading', props: { level: 2, text: 'Contributing' } },
  { id: genId(), type: 'paragraph', props: { text: 'Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) before submitting a pull request.' } },
  { id: genId(), type: 'code', props: { language: 'bash', code: 'git clone https://github.com/user/my-awesome-project.git\ncd my-awesome-project\nnpm install\nnpm test' } },
  { id: genId(), type: 'heading', props: { level: 2, text: 'Author' } },
  { id: genId(), type: 'gitshow', props: { username: 'ofershap' } },
  { id: genId(), type: 'socialLinks', props: { links: [
    { platform: 'LinkedIn', handle: 'ofershap', url: 'https://linkedin.com/in/ofershap' },
    { platform: 'GitHub', handle: 'ofershap', url: 'https://github.com/ofershap' },
  ], align: 'left' } },
  { id: genId(), type: 'heading', props: { level: 2, text: 'License' } },
  { id: genId(), type: 'paragraph', props: { text: 'MIT -- see [LICENSE](LICENSE) for details.' } },
];

function loadBlocks(): Block[] {
  try {
    const saved = localStorage.getItem('readme-builder-blocks');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_BLOCKS;
}

function blocksToMarkdown(blocks: Block[]): string {
  return generateMarkdown(blocks);
}

const initialBlocks = loadBlocks();

export const useStore = create<ReadmeStore>()(
  temporal(
    (set) => ({
      blocks: initialBlocks,
      selectedBlockId: null,
      activeTab: 'visual' as const,
      markdown: blocksToMarkdown(initialBlocks),
      fileName: 'README.md',

      addBlock: (type, index) => {
        const def = BLOCK_DEFINITIONS.find(d => d.type === type);
        if (!def) return;
        const block: Block = { id: genId(), type, props: structuredClone(def.defaultProps) };
        set(state => {
          const blocks = [...state.blocks];
          const insertAt = index !== undefined ? index : blocks.length;
          blocks.splice(insertAt, 0, block);
          return { blocks, markdown: blocksToMarkdown(blocks), selectedBlockId: block.id };
        });
      },

      removeBlock: (id) => set(state => {
        const blocks = state.blocks.filter(b => b.id !== id);
        return {
          blocks,
          markdown: blocksToMarkdown(blocks),
          selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
        };
      }),

      updateBlock: (id, props) => set(state => {
        const blocks = state.blocks.map(b =>
          b.id === id ? { ...b, props: { ...b.props, ...props } as BlockProps } : b
        );
        return { blocks, markdown: blocksToMarkdown(blocks) };
      }),

      selectBlock: (id) => set({ selectedBlockId: id }),

      setTab: (tab) => set({ activeTab: tab }),

      duplicateBlock: (id) => set(state => {
        const idx = state.blocks.findIndex(b => b.id === id);
        if (idx === -1) return state;
        const original = state.blocks[idx];
        const block: Block = { id: genId(), type: original.type, props: structuredClone(original.props) };
        const blocks = [...state.blocks];
        blocks.splice(idx + 1, 0, block);
        return { blocks, markdown: blocksToMarkdown(blocks), selectedBlockId: block.id };
      }),

      setBlocks: (blocks) => set({ blocks, markdown: blocksToMarkdown(blocks) }),

      setFileName: (name) => set({ fileName: name }),

      resetToDefault: () => {
        localStorage.removeItem('readme-builder-blocks');
        set({ blocks: DEFAULT_BLOCKS, markdown: blocksToMarkdown(DEFAULT_BLOCKS), selectedBlockId: null });
      },
    }),
    {
      partialize: (state) => ({ blocks: state.blocks }),
      limit: 50,
    }
  )
);

let prevBlocks = initialBlocks;
useStore.subscribe(state => {
  localStorage.setItem('readme-builder-blocks', JSON.stringify(state.blocks));
  if (state.blocks !== prevBlocks) {
    prevBlocks = state.blocks;
    if (state.markdown !== blocksToMarkdown(state.blocks)) {
      useStore.setState({ markdown: blocksToMarkdown(state.blocks) });
    }
  }
});
