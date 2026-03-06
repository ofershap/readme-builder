import { useState } from 'react';
import { useStore } from '../store';
import { BLOCK_DEFINITIONS } from '../blocks/registry';
import type { BlockType } from '../types';
import * as Icons from 'lucide-react';
import { PanelLeftOpen, PanelLeftClose, Github } from 'lucide-react';

const REPO_URL = 'https://github.com/ofershap/readme-builder';

export function BlockPalette() {
  const addBlock = useStore(s => s.addBlock);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-gray-900 border-r border-gray-700 flex flex-col h-full shrink-0 transition-all duration-200 ${expanded ? 'w-48' : 'w-12'}`}>
      <div className={`p-2 border-b border-gray-700 flex items-center ${expanded ? 'justify-between' : 'justify-center'}`}>
        {expanded && <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Blocks</span>}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-gray-500 hover:text-gray-300 rounded hover:bg-gray-800 cursor-pointer"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>
      <div className="p-1.5 space-y-0.5 flex-1 overflow-y-auto">
        {BLOCK_DEFINITIONS.map(def => {
          const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[def.icon];
          return (
            <button
              key={def.type}
              onClick={() => addBlock(def.type as BlockType)}
              className={`w-full flex items-center rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer ${expanded ? 'gap-2.5 px-2.5 py-1.5 text-sm' : 'justify-center p-2'}`}
              title={expanded ? undefined : def.label}
            >
              {IconComp && <IconComp size={15} />}
              {expanded && <span className="text-sm">{def.label}</span>}
            </button>
          );
        })}
      </div>
      <div className={`p-2 border-t border-gray-700 ${expanded ? '' : 'flex justify-center'}`}>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center text-gray-500 hover:text-gray-300 transition-colors ${expanded ? 'gap-2 px-2 py-1.5' : 'p-1'}`}
          title="Star us on GitHub"
        >
          <Github size={15} />
          {expanded && <span className="text-xs text-gray-500 hover:text-gray-300">GitHub</span>}
        </a>
      </div>
    </div>
  );
}
