import { useEffect, useRef } from 'react';
import { EditorView, lineNumbers, drawSelection, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { useStore } from '../store';
import { Preview } from './Preview';
import { Copy } from 'lucide-react';
import { useState } from 'react';

export function MarkdownTab() {
  const md = useStore(s => s.markdown);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    const view = new EditorView({
      state: EditorState.create({
        doc: md,
        extensions: [
          EditorView.editable.of(false),
          lineNumbers(),
          drawSelection(),
          highlightActiveLine(),
          markdown(),
          oneDark,
          EditorView.theme({
            '&': { height: '100%', fontSize: '13px' },
            '.cm-scroller': { overflow: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' },
            '.cm-content': { padding: '16px 0' },
            '.cm-gutters': { backgroundColor: '#1e1e2e', borderRight: '1px solid #333' },
          }),
        ],
      }),
      parent: editorRef.current,
    });
    viewRef.current = view;
    return () => view.destroy();
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== md) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: md },
      });
    }
  }, [md]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 h-full min-h-0">
      <div className="flex-1 flex flex-col h-full border-r border-gray-700 bg-[#1e1e2e]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 shrink-0">
          <span className="text-xs font-medium text-gray-400">Generated Markdown (read-only)</span>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white rounded hover:bg-gray-700 cursor-pointer">
            <Copy size={12} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex-1 overflow-hidden" ref={editorRef} />
      </div>
      <Preview />
    </div>
  );
}
