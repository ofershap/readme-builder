import { useState, useRef } from 'react';
import type { Block, HeadingProps, ParagraphProps, CodeProps, ImageProps, ListProps, TableProps, BlockquoteProps, AlertProps, RawProps, BadgesProps, DetailsProps, CenteredProps, ColumnsProps, ButtonRowProps, SpacerProps, GitShowProps, SocialLinksProps, SocialLink } from '../types';
import { SOCIAL_PLATFORMS } from '../blocks/markdown';
import { useStore } from '../store';
import { X } from 'lucide-react';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500";
const textareaCls = "w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 font-mono resize-y";
const selectCls = "bg-gray-800 border border-gray-600 rounded px-2.5 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500";

function HeadingEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as HeadingProps;
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Field label="Level">
          <select value={p.level} onChange={e => update(block.id, { level: Number(e.target.value) as 1|2|3|4|5|6 })} className={selectCls}>
            {[1,2,3,4,5,6].map(l => <option key={l} value={l}>H{l}</option>)}
          </select>
        </Field>
        <Field label="Align">
          <select value={p.align || 'left'} onChange={e => update(block.id, { align: e.target.value as 'left'|'center'|'right' })} className={selectCls}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
      </div>
      <Field label="Text">
        <input value={p.text} onChange={e => update(block.id, { text: e.target.value })} className={inputCls} />
      </Field>
    </div>
  );
}

function ParagraphEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as ParagraphProps;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (before: string, after: string, placeholder: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = p.text;
    const selected = text.slice(start, end) || placeholder;
    const newText = text.slice(0, start) + before + selected + after + text.slice(end);
    update(block.id, { text: newText });
    setTimeout(() => {
      ta.focus();
      const cursorPos = start + before.length + selected.length + after.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  return (
    <div className="space-y-2">
      <Field label="Text">
        <div className="flex gap-1 mb-1">
          <button onClick={() => insertFormat('**', '**', 'bold')} className="px-2 py-1 text-xs font-bold bg-gray-700 hover:bg-gray-600 rounded text-gray-300 cursor-pointer" title="Bold">B</button>
          <button onClick={() => insertFormat('*', '*', 'italic')} className="px-2 py-1 text-xs italic bg-gray-700 hover:bg-gray-600 rounded text-gray-300 cursor-pointer" title="Italic">I</button>
          <button onClick={() => insertFormat('`', '`', 'code')} className="px-2 py-1 text-xs font-mono bg-gray-700 hover:bg-gray-600 rounded text-gray-300 cursor-pointer" title="Inline code">&lt;&gt;</button>
          <button onClick={() => insertFormat('[', '](url)', 'link text')} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300 cursor-pointer" title="Link">🔗</button>
          <button onClick={() => insertFormat('~~', '~~', 'text')} className="px-2 py-1 text-xs line-through bg-gray-700 hover:bg-gray-600 rounded text-gray-300 cursor-pointer" title="Strikethrough">S</button>
        </div>
        <textarea ref={textareaRef} value={p.text} onChange={e => update(block.id, { text: e.target.value })} className={textareaCls} rows={6} />
      </Field>
    </div>
  );
}

function CodeEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as CodeProps;
  const languages = ['bash','typescript','javascript','python','json','yaml','html','css','go','rust','java','sql','diff','markdown','plaintext'];
  return (
    <div className="space-y-3">
      <Field label="Language">
        <select value={p.language} onChange={e => update(block.id, { language: e.target.value })} className={selectCls}>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </Field>
      <Field label="Code">
        <textarea value={p.code} onChange={e => update(block.id, { code: e.target.value })} className={textareaCls} rows={6} />
      </Field>
    </div>
  );
}

function ImageEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as ImageProps;
  return (
    <div className="space-y-3">
      <Field label="Image URL">
        <input value={p.url} onChange={e => update(block.id, { url: e.target.value })} className={inputCls} placeholder="https://..." />
      </Field>
      <div className="flex gap-3">
        <Field label="Alt text">
          <input value={p.alt} onChange={e => update(block.id, { alt: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Width">
          <input value={p.width || ''} onChange={e => update(block.id, { width: e.target.value })} className={inputCls} placeholder="e.g. 600" />
        </Field>
        <Field label="Align">
          <select value={p.align || 'left'} onChange={e => update(block.id, { align: e.target.value as 'left'|'center'|'right' })} className={selectCls}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function ListEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as ListProps;
  const setItem = (idx: number, text: string) => {
    const items = [...p.items];
    items[idx] = { ...items[idx], text };
    update(block.id, { items });
  };
  const toggleCheck = (idx: number) => {
    const items = [...p.items];
    items[idx] = { ...items[idx], checked: !items[idx].checked };
    update(block.id, { items });
  };
  const addItem = () => update(block.id, { items: [...p.items, { text: 'New item' }] });
  const removeItem = (idx: number) => update(block.id, { items: p.items.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-3">
      <Field label="Style">
        <select value={p.style} onChange={e => update(block.id, { style: e.target.value as 'unordered'|'ordered'|'task' })} className={selectCls}>
          <option value="unordered">Unordered</option>
          <option value="ordered">Ordered</option>
          <option value="task">Task list</option>
        </select>
      </Field>
      <Field label="Items">
        <div className="space-y-1.5">
          {p.items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              {p.style === 'task' && (
                <input type="checkbox" checked={item.checked || false} onChange={() => toggleCheck(i)} className="accent-blue-500" />
              )}
              <input value={item.text} onChange={e => setItem(i, e.target.value)} className={inputCls + ' flex-1'} />
              <button onClick={() => removeItem(i)} className="text-gray-500 hover:text-red-400 cursor-pointer"><X size={14} /></button>
            </div>
          ))}
          <button onClick={addItem} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">+ Add item</button>
        </div>
      </Field>
    </div>
  );
}

function TableEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as TableProps;

  const setHeader = (i: number, val: string) => {
    const headers = [...p.headers];
    headers[i] = val;
    update(block.id, { headers });
  };
  const setCell = (r: number, c: number, val: string) => {
    const rows = p.rows.map(row => [...row]);
    rows[r][c] = val;
    update(block.id, { rows });
  };
  const addColumn = () => {
    update(block.id, {
      headers: [...p.headers, `Column ${p.headers.length + 1}`],
      rows: p.rows.map(row => [...row, '']),
    });
  };
  const removeColumn = (ci: number) => {
    if (p.headers.length <= 1) return;
    update(block.id, {
      headers: p.headers.filter((_, i) => i !== ci),
      rows: p.rows.map(row => row.filter((_, i) => i !== ci)),
    });
  };
  const addRow = () => {
    update(block.id, { rows: [...p.rows, p.headers.map(() => '')] });
  };
  const removeRow = (ri: number) => {
    update(block.id, { rows: p.rows.filter((_, i) => i !== ri) });
  };

  return (
    <div className="space-y-3">
      <Field label="Table">
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr>
                {p.headers.map((h, i) => (
                  <th key={i} className="p-1">
                    <div className="flex gap-1">
                      <input value={h} onChange={e => setHeader(i, e.target.value)} className={inputCls + ' min-w-[100px]'} />
                      {p.headers.length > 1 && (
                        <button onClick={() => removeColumn(i)} className="text-gray-500 hover:text-red-400 shrink-0 cursor-pointer" title="Remove column"><X size={12} /></button>
                      )}
                    </div>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {p.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-1"><input value={cell} onChange={e => setCell(ri, ci, e.target.value)} className={inputCls + ' min-w-[100px]'} /></td>
                  ))}
                  <td className="p-1">
                    <button onClick={() => removeRow(ri)} className="text-gray-500 hover:text-red-400 cursor-pointer" title="Remove row"><X size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3 mt-2">
          <button onClick={addColumn} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">+ Column</button>
          <button onClick={addRow} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">+ Row</button>
        </div>
      </Field>
    </div>
  );
}

function BlockquoteEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as BlockquoteProps;
  return (
    <Field label="Quote text (supports multiple lines)">
      <textarea value={p.text} onChange={e => update(block.id, { text: e.target.value })} className={textareaCls} rows={5} />
    </Field>
  );
}

function AlertEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as AlertProps;
  return (
    <div className="space-y-3">
      <Field label="Type">
        <div className="flex gap-1.5">
          {(['NOTE','TIP','IMPORTANT','WARNING','CAUTION'] as const).map(t => (
            <button key={t} onClick={() => update(block.id, { type: t })} className={`px-2.5 py-1 text-xs rounded cursor-pointer ${p.type === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t}</button>
          ))}
        </div>
      </Field>
      <Field label="Content (supports multiple lines)">
        <textarea value={p.text} onChange={e => update(block.id, { text: e.target.value })} className={textareaCls} rows={5} placeholder="Write your alert content here.\nUse multiple lines as needed." />
      </Field>
    </div>
  );
}

function RawEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as RawProps;
  return (
    <Field label="Raw Markdown / HTML">
      <textarea value={p.content} onChange={e => update(block.id, { content: e.target.value })} className={textareaCls} rows={12} placeholder="Enter any markdown or HTML that GitHub supports..." />
    </Field>
  );
}

function BadgesEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as BadgesProps;
  const [repoName, setRepoName] = useState('user/repo');
  const [pkgName, setPkgName] = useState('my-package');

  const addBadge = () => {
    const badge = { id: crypto.randomUUID(), label: 'label', message: 'value', color: 'blue', style: 'flat' as const };
    update(block.id, { badges: [...p.badges, badge] });
  };
  const removeBadge = (id: string) => {
    update(block.id, { badges: p.badges.filter(b => b.id !== id) });
  };
  const updateBadge = (id: string, changes: Record<string, unknown>) => {
    update(block.id, { badges: p.badges.map(b => b.id === id ? { ...b, ...changes } : b) });
  };

  const presets = [
    { name: 'npm version', make: () => ({ label: 'npm version', message: '', color: 'red', logo: 'npm', style: 'flat' as const, preset: `https://img.shields.io/npm/v/${pkgName}`, url: `https://www.npmjs.com/package/${pkgName}` }) },
    { name: 'npm downloads', make: () => ({ label: 'npm downloads', message: '', color: 'blue', logo: 'npm', style: 'flat' as const, preset: `https://img.shields.io/npm/dm/${pkgName}`, url: `https://www.npmjs.com/package/${pkgName}` }) },
    { name: 'CI status', make: () => ({ label: 'CI', message: '', color: 'brightgreen', logo: 'githubactions', style: 'flat' as const, preset: `https://github.com/${repoName}/actions/workflows/ci.yml/badge.svg`, url: `https://github.com/${repoName}/actions` }) },
    { name: 'GitHub stars', make: () => ({ label: 'stars', message: '', color: 'yellow', logo: 'github', style: 'flat' as const, preset: `https://img.shields.io/github/stars/${repoName}`, url: `https://github.com/${repoName}` }) },
    { name: 'License MIT', make: () => ({ label: 'License', message: 'MIT', color: 'yellow', style: 'flat' as const }) },
    { name: 'TypeScript', make: () => ({ label: 'TypeScript', message: 'strict', color: '3178C6', style: 'flat' as const, logo: 'typescript', logoColor: 'white' }) },
    { name: 'Bundle size', make: () => ({ label: 'bundle size', message: '', color: 'green', style: 'flat' as const, preset: `https://img.shields.io/bundlephobia/minzip/${pkgName}` }) },
  ];

  const LOGOS = [
    { label: 'npm', value: 'npm' },
    { label: 'Node.js', value: 'nodedotjs' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vuedotjs' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Next.js', value: 'nextdotjs' },
    { label: 'Python', value: 'python' },
    { label: 'Rust', value: 'rust' },
    { label: 'Go', value: 'go' },
    { label: 'Java', value: 'openjdk' },
    { label: 'Docker', value: 'docker' },
    { label: 'GitHub', value: 'github' },
    { label: 'GitHub Actions', value: 'githubactions' },
    { label: 'GitLab', value: 'gitlab' },
    { label: 'Git', value: 'git' },
    { label: 'AWS', value: 'amazonaws' },
    { label: 'Vercel', value: 'vercel' },
    { label: 'Netlify', value: 'netlify' },
    { label: 'Jest', value: 'jest' },
    { label: 'Vitest', value: 'vitest' },
    { label: 'ESLint', value: 'eslint' },
    { label: 'Prettier', value: 'prettier' },
    { label: 'Tailwind CSS', value: 'tailwindcss' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'MongoDB', value: 'mongodb' },
    { label: 'Redis', value: 'redis' },
    { label: 'Linux', value: 'linux' },
    { label: 'Apple', value: 'apple' },
    { label: 'Windows', value: 'windows' },
  ];

  const COLORS = [
    { label: 'Green', value: 'brightgreen', hex: '#44cc11' },
    { label: 'Forest', value: '339933', hex: '#339933' },
    { label: 'Teal', value: '00897B', hex: '#00897B' },
    { label: 'Yellow', value: 'yellow', hex: '#dfb317' },
    { label: 'Orange', value: 'orange', hex: '#fe7d37' },
    { label: 'Red', value: 'red', hex: '#e05d44' },
    { label: 'Blue', value: 'blue', hex: '#007ec6' },
    { label: 'Royal', value: '0078D4', hex: '#0078D4' },
    { label: 'React', value: '61DAFB', hex: '#61DAFB' },
    { label: 'TS Blue', value: '3178C6', hex: '#3178C6' },
    { label: 'Violet', value: 'blueviolet', hex: '#8A2BE2' },
    { label: 'Pink', value: 'ff69b4', hex: '#ff69b4' },
    { label: 'Gray', value: 'lightgrey', hex: '#9f9f9f' },
    { label: 'Black', value: '000000', hex: '#000000' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-end">
        <Field label="Align">
          <select value={p.align} onChange={e => update(block.id, { align: e.target.value as 'left'|'center'|'right' })} className={selectCls}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
        <Field label="GitHub repo">
          <input value={repoName} onChange={e => setRepoName(e.target.value)} className={inputCls} placeholder="user/repo" />
        </Field>
        <Field label="npm package">
          <input value={pkgName} onChange={e => setPkgName(e.target.value)} className={inputCls} placeholder="my-package" />
        </Field>
      </div>
      <div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quick add</span>
        <div className="flex gap-1.5 flex-wrap mt-1">
          {presets.map(preset => (
            <button key={preset.name} onClick={() => {
              const badge = { id: crypto.randomUUID(), ...preset.make() };
              update(block.id, { badges: [...p.badges, badge] });
            }} className="px-2.5 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300 cursor-pointer">
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {p.badges.map(badge => (
          <div key={badge.id} className="p-3 border border-gray-700 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={badge.preset || `https://img.shields.io/badge/${encodeURIComponent(badge.label)}-${encodeURIComponent(badge.message)}-${encodeURIComponent(badge.color)}?style=${badge.style}${badge.logo ? '&logo=' + encodeURIComponent(badge.logo) : ''}${badge.logoColor ? '&logoColor=' + encodeURIComponent(badge.logoColor) : ''}`}
                  alt="badge preview"
                  className="h-5"
                />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (badge.preset) {
                      updateBadge(badge.id, { preset: undefined });
                    } else {
                      const url = `https://img.shields.io/badge/${encodeURIComponent(badge.label)}-${encodeURIComponent(badge.message)}-${encodeURIComponent(badge.color)}?style=${badge.style}${badge.logo ? '&logo=' + encodeURIComponent(badge.logo) : ''}`;
                      updateBadge(badge.id, { preset: url });
                    }
                  }}
                  className={`text-[10px] px-1.5 py-0.5 cursor-pointer rounded ${badge.preset ? 'text-green-400 bg-green-900/30 hover:bg-green-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                  title={badge.preset ? 'Switch to static (editable label/color/style)' : 'Switch to live (fetches from URL)'}
                >
                  {badge.preset ? 'LIVE' : 'STATIC'}
                </button>
                <button onClick={() => removeBadge(badge.id)} className="text-gray-500 hover:text-red-400 cursor-pointer"><X size={14} /></button>
              </div>
            </div>
            {badge.preset ? (
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-gray-500">Badge URL (shields.io)</span>
                  <input value={badge.preset} onChange={e => updateBadge(badge.id, { preset: e.target.value })} placeholder="https://img.shields.io/..." className={inputCls} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Link URL (click destination)</span>
                  <input value={badge.url || ''} onChange={e => updateBadge(badge.id, { url: e.target.value })} placeholder="https://..." className={inputCls} />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-500">Label</span>
                    <input value={badge.label} onChange={e => updateBadge(badge.id, { label: e.target.value })} placeholder="Label" className={inputCls} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">Message</span>
                    <input value={badge.message} onChange={e => updateBadge(badge.id, { message: e.target.value })} placeholder="Message" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-500">Logo</span>
                    <select value={badge.logo || ''} onChange={e => updateBadge(badge.id, { logo: e.target.value })} className={selectCls + ' w-full'}>
                      <option value="">None</option>
                      {LOGOS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">Style</span>
                    <select value={badge.style} onChange={e => updateBadge(badge.id, { style: e.target.value })} className={selectCls + ' w-full'}>
                      <option value="flat">Flat</option>
                      <option value="flat-square">Square</option>
                      <option value="plastic">Plastic</option>
                      <option value="for-the-badge">Large</option>
                      <option value="social">Social</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">Link URL</span>
                    <input value={badge.url || ''} onChange={e => updateBadge(badge.id, { url: e.target.value })} placeholder="https://..." className={inputCls} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Color</span>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => updateBadge(badge.id, { color: c.value })}
                        className={`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform ${badge.color === c.value ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : 'border-gray-600'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                    <input
                      value={badge.color}
                      onChange={e => updateBadge(badge.id, { color: e.target.value })}
                      className="w-20 bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="custom"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={addBadge} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">+ Add custom badge</button>
    </div>
  );
}

function DetailsEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as DetailsProps;
  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-end">
        <Field label="Summary (visible text)">
          <input value={p.summary} onChange={e => update(block.id, { summary: e.target.value })} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-300 pb-1.5">
          <input type="checkbox" checked={p.open || false} onChange={e => update(block.id, { open: e.target.checked })} className="accent-blue-500" />
          Open by default
        </label>
      </div>
      <Field label="Content (markdown)">
        <textarea value={p.content} onChange={e => update(block.id, { content: e.target.value })} className={textareaCls} rows={5} />
      </Field>
    </div>
  );
}

function CenteredEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as CenteredProps;
  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 bg-gray-800/50 rounded p-2">
        Everything inside this block will be horizontally centered. You can use markdown: <code className="text-blue-400">**bold**</code>, <code className="text-blue-400"># Heading</code>, or any text.
      </div>
      <Field label="Centered content">
        <textarea value={p.content} onChange={e => update(block.id, { content: e.target.value })} className={textareaCls} rows={5} placeholder="# My Title\n\nSubtitle text here" />
      </Field>
    </div>
  );
}

function ColumnsEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as ColumnsProps;
  const setColumn = (idx: number, content: string) => {
    const columns = p.columns.map((col, i) => i === idx ? { ...col, content } : col);
    update(block.id, { columns });
  };
  const addColumn = () => {
    if (p.columns.length >= 4) return;
    update(block.id, { columns: [...p.columns, { content: `Column ${p.columns.length + 1}` }] });
  };
  const removeColumn = (idx: number) => {
    if (p.columns.length <= 2) return;
    update(block.id, { columns: p.columns.filter((_, i) => i !== idx) });
  };
  return (
    <div className="space-y-3">
      <Field label={`Columns (${p.columns.length})`}>
        <div className="space-y-2">
          {p.columns.map((col, i) => (
            <div key={i} className="flex gap-2">
              <textarea value={col.content} onChange={e => setColumn(i, e.target.value)} className={textareaCls + ' flex-1'} rows={3} placeholder={`Column ${i + 1} content (markdown)`} />
              {p.columns.length > 2 && (
                <button onClick={() => removeColumn(i)} className="text-gray-500 hover:text-red-400 self-start mt-1.5 cursor-pointer"><X size={14} /></button>
              )}
            </div>
          ))}
        </div>
        {p.columns.length < 4 && (
          <button onClick={addColumn} className="text-xs text-blue-400 hover:text-blue-300 mt-2 cursor-pointer">+ Add column</button>
        )}
      </Field>
    </div>
  );
}

function ButtonRowEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as ButtonRowProps;
  const align = p.align ?? 'center';
  const buttons = p.buttons.map(btn => ({
    ...btn,
    color: btn.color ?? '0078D4',
    style: (btn.style ?? 'for-the-badge') as 'for-the-badge' | 'flat' | 'flat-square' | 'plastic',
  }));
  const COLORS = [
    { name: 'Blue', value: '0078D4' },
    { name: 'Green', value: '00C853' },
    { name: 'Red', value: 'D32F2F' },
    { name: 'Purple', value: '7B1FA2' },
    { name: 'Orange', value: 'F57C00' },
    { name: 'Teal', value: '00897B' },
    { name: 'Pink', value: 'E91E63' },
    { name: 'Gray', value: '546E7A' },
    { name: 'Black', value: '000000' },
  ];
  const setButton = (idx: number, changes: Record<string, string>) => {
    const next = buttons.map((btn, i) => i === idx ? { ...btn, ...changes } : btn);
    update(block.id, { buttons: next });
  };
  const addButton = () => update(block.id, { buttons: [...buttons, { label: 'Button', url: '#', color: '0078D4', style: 'for-the-badge' as const }] });
  const removeButton = (idx: number) => update(block.id, { buttons: buttons.filter((_, i) => i !== idx) });
  return (
    <div className="space-y-3">
      <Field label="Alignment">
        <select value={align} onChange={e => update(block.id, { align: e.target.value as 'left'|'center'|'right' })} className={selectCls}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </Field>
      <Field label="Buttons">
        <div className="space-y-3">
          {buttons.map((btn, i) => (
            <div key={i} className="p-3 border border-gray-700 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <img src={`https://img.shields.io/badge/-${encodeURIComponent(btn.label)}-${encodeURIComponent(btn.color)}?style=${btn.style}${btn.logo ? '&logo=' + encodeURIComponent(btn.logo) + '&logoColor=white' : ''}`} alt="preview" className="h-7" />
                <button onClick={() => removeButton(i)} className="text-gray-500 hover:text-red-400 cursor-pointer"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={btn.label} onChange={e => setButton(i, { label: e.target.value })} className={inputCls} placeholder="Label" />
                <input value={btn.url} onChange={e => setButton(i, { url: e.target.value })} className={inputCls} placeholder="URL" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex gap-1 flex-wrap">
                    {COLORS.map(c => (
                      <button key={c.value} onClick={() => setButton(i, { color: c.value })} className={`w-5 h-5 rounded border cursor-pointer hover:scale-110 transition-transform ${btn.color === c.value ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : 'border-gray-600'}`} style={{ backgroundColor: `#${c.value}` }} title={c.name} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <select value={btn.style} onChange={e => setButton(i, { style: e.target.value })} className={selectCls + ' flex-1'}>
                    <option value="for-the-badge">Large</option>
                    <option value="flat">Flat</option>
                    <option value="flat-square">Square</option>
                    <option value="plastic">Plastic</option>
                  </select>
                  <input value={btn.logo || ''} onChange={e => setButton(i, { logo: e.target.value })} className={inputCls + ' flex-1'} placeholder="Logo (optional)" />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addButton} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">+ Add button</button>
        </div>
      </Field>
    </div>
  );
}

function SpacerEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as SpacerProps;
  return (
    <Field label="Line breaks">
      <input type="number" min={1} max={10} value={p.lines} onChange={e => update(block.id, { lines: Number(e.target.value) })} className={inputCls + ' w-24'} />
    </Field>
  );
}

function socialBadgeUrl(link: SocialLink): string {
  const config = SOCIAL_PLATFORMS[link.platform];
  if (!config) return '';
  return `https://img.shields.io/badge/${encodeURIComponent(link.platform)}-${encodeURIComponent(config.label)}-${config.color}?style=flat&logo=${encodeURIComponent(config.logo)}&logoColor=white`;
}

function GitShowEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as GitShowProps;
  return (
    <div className="space-y-3">
      <Field label="GitHub username">
        <input value={p.username} onChange={e => update(block.id, { username: e.target.value })} className={inputCls} placeholder="ofershap" />
      </Field>
      {p.username && (
        <div className="pt-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Preview</span>
          <a href={`https://gitshow.dev/${p.username}`} target="_blank" rel="noopener noreferrer" className="block mt-1.5">
            <img src={`https://gitshow.dev/api/card/${encodeURIComponent(p.username)}`} alt={`Made by ${p.username}`} className="h-14" />
          </a>
        </div>
      )}
    </div>
  );
}

function SocialLinksEditor({ block }: { block: Block }) {
  const update = useStore(s => s.updateBlock);
  const p = block.props as SocialLinksProps;
  const platformKeys = Object.keys(SOCIAL_PLATFORMS);

  const addLink = (platform?: string) => {
    const plat = platform ?? platformKeys[0];
    const config = SOCIAL_PLATFORMS[plat];
    const handle = '';
    const url = config ? config.urlTemplate.replace('{handle}', handle) : '';
    update(block.id, { links: [...p.links, { platform: plat, handle, url }] });
  };

  const removeLink = (idx: number) => {
    update(block.id, { links: p.links.filter((_, i) => i !== idx) });
  };

  const updateLink = (idx: number, changes: Partial<SocialLink>) => {
    const links = p.links.map((link, i) => (i === idx ? { ...link, ...changes } : link));
    if (changes.platform !== undefined) {
      const config = SOCIAL_PLATFORMS[changes.platform];
      if (config && links[idx]) {
        links[idx] = { ...links[idx], url: config.urlTemplate.replace('{handle}', links[idx].handle) };
      }
    } else if (changes.handle !== undefined && links[idx]) {
      const config = SOCIAL_PLATFORMS[links[idx].platform];
      if (config) {
        links[idx] = { ...links[idx], url: config.urlTemplate.replace('{handle}', changes.handle) };
      }
    }
    update(block.id, { links });
  };

  const setLinkUrl = (idx: number, url: string) => {
    const links = [...p.links];
    links[idx] = { ...links[idx], url };
    update(block.id, { links });
  };

  return (
    <div className="space-y-3">
      <Field label="Align">
        <select value={p.align} onChange={e => update(block.id, { align: e.target.value as 'left' | 'center' | 'right' })} className={selectCls}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </Field>
      <div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quick add</span>
        <div className="flex gap-1.5 flex-wrap mt-1">
          {platformKeys.map(platform => (
            <button key={platform} onClick={() => addLink(platform)} className="px-2.5 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300 cursor-pointer">
              {platform}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {p.links.map((link, i) => (
          <div key={i} className="p-3 border border-gray-700 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              {socialBadgeUrl(link) && (
                <img src={socialBadgeUrl(link)} alt={link.platform} className="h-5" />
              )}
              <button onClick={() => removeLink(i)} className="text-gray-500 hover:text-red-400 cursor-pointer ml-auto"><X size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-gray-500">Platform</span>
                <select value={link.platform} onChange={e => updateLink(i, { platform: e.target.value })} className={selectCls + ' w-full'}>
                  {platformKeys.map(plat => <option key={plat} value={plat}>{plat}</option>)}
                </select>
              </div>
              <div>
                <span className="text-[10px] text-gray-500">Handle</span>
                <input value={link.handle} onChange={e => updateLink(i, { handle: e.target.value })} className={inputCls} placeholder="username or URL" />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-500">URL</span>
              <input value={link.url} onChange={e => setLinkUrl(i, e.target.value)} className={inputCls} placeholder="https://..." />
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => addLink()} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">+ Add link</button>
    </div>
  );
}

const EDITORS: Record<string, React.ComponentType<{ block: Block }>> = {
  heading: HeadingEditor,
  paragraph: ParagraphEditor,
  code: CodeEditor,
  image: ImageEditor,
  list: ListEditor,
  table: TableEditor,
  blockquote: BlockquoteEditor,
  alert: AlertEditor,
  badges: BadgesEditor,
  details: DetailsEditor,
  centered: CenteredEditor,
  columns: ColumnsEditor,
  buttonRow: ButtonRowEditor,
  spacer: SpacerEditor,
  gitshow: GitShowEditor,
  socialLinks: SocialLinksEditor,
  raw: RawEditor,
};

export function BlockEditor({ block }: { block: Block }) {
  const Editor = EDITORS[block.type];
  const selectBlock = useStore(s => s.selectBlock);

  if (!Editor && block.type === 'hr') {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-500">Horizontal rule has no configurable properties.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 shrink-0 sticky top-0 bg-gray-900 z-10">
        <h3 className="text-sm font-semibold text-gray-300">Edit {block.type}</h3>
        <button onClick={() => selectBlock(null)} className="text-gray-500 hover:text-gray-300 cursor-pointer"><X size={16} /></button>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        {Editor && <Editor block={block} />}
      </div>
    </div>
  );
}
