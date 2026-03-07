import { useStore } from '../store';
import { useTemporalStore } from '../hooks/useTemporalStore';
import { Copy, Download, RotateCcw, Undo2, Redo2, FileText, Upload, FileCode2, Github, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { TemplateModal } from './TemplateModal';
import { ImportModal } from './ImportModal';

const ATTRIBUTION = '\n\n---\n\n<sub>Built with [README Builder](https://ofershap.github.io/readme-builder/) — visual drag-and-drop editor for GitHub READMEs</sub>\n';

function withAttribution(md: string): string {
  return md + ATTRIBUTION;
}

export function Toolbar() {
  const activeTab = useStore(s => s.activeTab);
  const setTab = useStore(s => s.setTab);
  const markdown = useStore(s => s.markdown);
  const fileName = useStore(s => s.fileName);
  const setFileName = useStore(s => s.setFileName);
  const resetToDefault = useStore(s => s.resetToDefault);
  const [editingName, setEditingName] = useState(false);
  const { undo, redo, pastStates, futureStates } = useTemporalStore();
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(withAttribution(markdown));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([withAttribution(markdown)], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    resetToDefault();
    setShowResetConfirm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-white tracking-tight">README Builder</span>
          <a
            href="https://github.com/ofershap/readme-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
            title="View on GitHub"
          >
            <Github size={15} />
          </a>
          <a
            href="#guide"
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
            title="README Best Practices Guide"
          >
            <BookOpen size={15} />
          </a>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800/50 rounded">
            <FileCode2 size={13} className="text-gray-500" />
            {editingName ? (
              <input
                autoFocus
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingName(false); }}
                className="bg-transparent text-xs text-gray-200 outline-none border-b border-blue-500 w-28"
              />
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="text-xs text-gray-400 hover:text-gray-200 cursor-pointer"
                title="Click to rename"
              >
                {fileName}
              </button>
            )}
          </div>
          <div className="flex bg-gray-800 rounded-md p-0.5">
            {(['visual', 'markdown'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTab(tab)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab === 'visual' ? 'Visual' : 'Markdown'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => undo()}
              disabled={pastStates.length === 0}
              className="p-1.5 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed rounded hover:bg-gray-800 cursor-pointer"
              title="Undo (⌘Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={() => redo()}
              disabled={futureStates.length === 0}
              className="p-1.5 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed rounded hover:bg-gray-800 cursor-pointer"
              title="Redo (⌘⇧Z)"
            >
              <Redo2 size={14} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowResetConfirm(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-200 rounded hover:bg-gray-800 cursor-pointer">
            <RotateCcw size={13} />
            Reset
          </button>
          <button onClick={() => setShowTemplates(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-200 rounded hover:bg-gray-800 cursor-pointer">
            <FileText size={13} />
            Templates
          </button>
          <div className="w-px h-5 bg-gray-700" />
          <button onClick={() => setShowImport(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-400 border border-amber-500/50 hover:bg-amber-500/10 rounded cursor-pointer">
            <Upload size={13} />
            Import
          </button>
          <button onClick={downloadMarkdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer">
            <Download size={13} />
            Export
          </button>
          <button onClick={copyMarkdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded cursor-pointer">
            <Copy size={13} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      {showTemplates && <TemplateModal onClose={() => setShowTemplates(false)} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-base font-semibold text-white mb-2">Reset all blocks?</h3>
            <p className="text-sm text-gray-400 mb-6">This will discard all your current blocks and restore the default template. This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
