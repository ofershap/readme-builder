import { useState, useRef } from 'react';
import { X, Upload, Github, FileUp } from 'lucide-react';
import { useStore } from '../store';
import { parseMarkdownToBlocks } from '../blocks/parser';

type Tab = 'paste' | 'github' | 'file';

export function ImportModal({ onClose }: { onClose: () => void }) {
  const setBlocks = useStore(s => s.setBlocks);
  const selectBlock = useStore(s => s.selectBlock);
  const setStoreName = useStore(s => s.setFileName);
  const [activeTab, setActiveTab] = useState<Tab>('paste');
  const [pasteText, setPasteText] = useState('');
  const [repoInput, setRepoInput] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doImport = (markdown: string) => {
    try {
      setError(null);
      const blocks = parseMarkdownToBlocks(markdown);
      setBlocks(blocks);
      selectBlock(null);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
    }
  };

  const handlePasteImport = () => {
    doImport(pasteText);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(reader.result as string);
      setError(null);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const handleFileImport = () => {
    if (fileName) setStoreName(fileName);
    doImport(fileContent);
  };

  const handleGitHubImport = async () => {
    const match = repoInput.trim().match(/^([\w.-]+)\/([\w.-]+)$/);
    if (!match) {
      setError('Enter owner/repo (e.g. facebook/react)');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.github.com/repos/${match[1]}/${match[2]}/readme`, {
        headers: { Accept: 'application/vnd.github.v3.raw' }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `HTTP ${res.status}`);
      }
      const markdown = await res.text();
      setStoreName('README.md');
      doImport(markdown);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-[600px] max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Import Markdown</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => { setActiveTab('paste'); setError(null); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium cursor-pointer ${
              activeTab === 'paste' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Upload size={16} />
            Paste
          </button>
          <button
            onClick={() => { setActiveTab('file'); setError(null); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium cursor-pointer ${
              activeTab === 'file' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileUp size={16} />
            File
          </button>
          <button
            onClick={() => { setActiveTab('github'); setError(null); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium cursor-pointer ${
              activeTab === 'github' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Github size={16} />
            GitHub
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste your README markdown here..."
                className="w-full h-64 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm font-mono placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                spellCheck={false}
              />
              <button
                onClick={handlePasteImport}
                disabled={!pasteText.trim()}
                className="w-full px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer"
              >
                Import
              </button>
            </div>
          )}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt,.mdx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
              >
                <FileUp size={28} />
                <span className="text-sm">{fileName || 'Choose a markdown file'}</span>
                <span className="text-xs text-gray-500">.md, .markdown, .txt, .mdx</span>
              </button>
              {fileName && (
                <button
                  onClick={handleFileImport}
                  disabled={!fileContent}
                  className="w-full px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer"
                >
                  Import {fileName}
                </button>
              )}
            </div>
          )}
          {activeTab === 'github' && (
            <div className="space-y-3">
              <input
                type="text"
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                placeholder="owner/repo (e.g. facebook/react)"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleGitHubImport}
                disabled={!repoInput.trim() || loading}
                className="w-full px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer"
              >
                {loading ? 'Fetching...' : 'Import'}
              </button>
            </div>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}
        </div>
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">Importing replaces all current blocks.</p>
        </div>
      </div>
    </div>
  );
}
