import { useState, useMemo, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { remarkAlert } from 'remark-github-blockquote-alert';
import 'remark-github-blockquote-alert/alert.css';
import 'github-markdown-css';
import { useStore } from '../store';
import { Sun, Moon } from 'lucide-react';

function PreviewImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [broken, setBroken] = useState(false);
  const prevSrc = useRef(props.src);

  if (prevSrc.current !== props.src) {
    prevSrc.current = props.src;
    if (broken) setBroken(false);
  }

  if (broken) {
    return (
      <span style={{ display: 'inline-block', padding: '4px 10px', background: '#21262d', border: '1px solid #30363d', borderRadius: 6, fontSize: 12, color: '#8b949e' }}>
        {props.alt || 'Image not found'}
      </span>
    );
  }
  return <img {...props} onError={() => setBroken(true)} />;
}

export function Preview() {
  const [dark, setDark] = useState(true);
  const markdown = useStore(s => s.markdown);
  const plugins = useMemo(() => [remarkGfm, remarkAlert], []);
  const rehypePlugins = useMemo(() => [rehypeRaw], []);
  const components = useMemo(() => ({ img: PreviewImg }), []);

  return (
    <div
      className="flex-1 flex flex-col h-full min-w-0"
      style={{ backgroundColor: dark ? '#0d1117' : '#ffffff' }}
      data-color-mode={dark ? 'dark' : 'light'}
      data-dark-theme="dark"
      data-light-theme="light"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 shrink-0">
        <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Preview</span>
        <button
          onClick={() => setDark(!dark)}
          className={`p-1.5 rounded ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} cursor-pointer`}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="markdown-body" style={{ backgroundColor: 'transparent', maxWidth: '100%' }}>
          <Markdown remarkPlugins={plugins} rehypePlugins={rehypePlugins} components={components}>
            {markdown}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
