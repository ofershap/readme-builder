import { useEffect, useSyncExternalStore } from 'react';
import { useStore } from './store';
import { Toolbar } from './components/Toolbar';
import { BlockPalette } from './components/BlockPalette';
import { Canvas } from './components/Canvas';
import { Preview } from './components/Preview';
import { MarkdownTab } from './components/MarkdownTab';
import { Guide } from './components/Guide';

function useHash() {
  return useSyncExternalStore(
    (cb) => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb); },
    () => window.location.hash,
  );
}

function Editor() {
  const activeTab = useStore(s => s.activeTab);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useStore.temporal.getState().undo();
      }
      if (meta && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        useStore.temporal.getState().redo();
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) return;
        const selected = useStore.getState().selectedBlockId;
        if (selected) {
          e.preventDefault();
          useStore.getState().removeBlock(selected);
        }
      }
      if (meta && e.key === 'c' && e.shiftKey) {
        e.preventDefault();
        const md = useStore.getState().markdown;
        const attribution = '\n\n---\n\n<sub>Built with [README Builder](https://ofershap.github.io/readme-builder/) — visual drag-and-drop editor for GitHub READMEs</sub>\n';
        navigator.clipboard.writeText(md + attribution);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-200">
      <Toolbar />
      <div className="flex flex-1 min-h-0">
        {activeTab === 'visual' ? (
          <>
            <BlockPalette />
            <Canvas />
            <Preview />
          </>
        ) : (
          <MarkdownTab />
        )}
      </div>
    </div>
  );
}

function App() {
  const hash = useHash();

  if (hash === '#guide') return <Guide />;
  return <Editor />;
}

export default App;
