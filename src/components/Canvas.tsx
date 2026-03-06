import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';
import { useStore } from '../store';
import type { Block } from '../types';
import { BLOCK_DEFINITIONS } from '../blocks/registry';
import * as Icons from 'lucide-react';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { BlockEditor } from './BlockEditor';

function getBlockSummary(block: Block): string {
  const p = block.props as Record<string, unknown>;
  switch (block.type) {
    case 'heading': return String(p.text || '');
    case 'paragraph': return String(p.text || '').slice(0, 80);
    case 'code': return `\`\`\`${p.language || ''}`;
    case 'image': return String(p.alt || p.url || 'Image');
    case 'list': return `${(p.items as Array<unknown>)?.length || 0} items`;
    case 'table': return `${(p.headers as Array<unknown>)?.length || 0} columns`;
    case 'hr': return 'Horizontal rule';
    case 'blockquote': return String(p.text || '').slice(0, 60);
    case 'alert': return `${p.type}: ${String(p.text || '').slice(0, 50)}`;
    case 'badges': return `${(p.badges as Array<unknown>)?.length || 0} badges`;
    case 'details': return `▸ ${String(p.summary || '').slice(0, 50)}`;
    case 'centered': return String(p.content || '').slice(0, 50);
    case 'columns': return `${(p.columns as Array<unknown>)?.length || 0} columns`;
    case 'buttonRow': return `${(p.buttons as Array<unknown>)?.length || 0} buttons`;
    case 'spacer': return `${p.lines || 1} line break${(p.lines as number) > 1 ? 's' : ''}`;
    case 'raw': return String(p.content || '').slice(0, 60) || 'Empty';
    default: return block.type;
  }
}

function SortableBlock({ block, index }: { block: Block; index: number }) {
  const { ref, handleRef, isDragSource } = useSortable({ id: block.id, index });
  const selectedBlockId = useStore(s => s.selectedBlockId);
  const selectBlock = useStore(s => s.selectBlock);
  const removeBlock = useStore(s => s.removeBlock);
  const duplicateBlock = useStore(s => s.duplicateBlock);
  const isSelected = selectedBlockId === block.id;
  const def = BLOCK_DEFINITIONS.find(d => d.type === block.type);
  const IconComp = def ? (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[def.icon] : null;

  return (
    <div
      ref={ref}
      onClick={() => selectBlock(block.id)}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
        isDragSource ? 'opacity-50' : ''
      } ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      }`}
    >
      <div ref={handleRef} className="cursor-grab text-gray-500 hover:text-gray-300">
        <GripVertical size={14} />
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-gray-400 shrink-0">
          {IconComp && <IconComp size={14} />}
        </span>
        <span className="text-xs font-medium text-gray-400 uppercase shrink-0">{def?.label}</span>
        <span className="text-sm text-gray-300 truncate">{getBlockSummary(block)}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); duplicateBlock(block.id); }}
          className="p-1 text-gray-500 hover:text-gray-300 cursor-pointer"
        >
          <Copy size={13} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); removeBlock(block.id); }}
          className="p-1 text-gray-500 hover:text-red-400 cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export function Canvas() {
  const blocks = useStore(s => s.blocks);
  const selectedBlockId = useStore(s => s.selectedBlockId);
  const setBlocks = useStore(s => s.setBlocks);
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="w-[400px] shrink-0 flex flex-col h-full min-w-0 bg-gray-950 border-r border-gray-700">
      <div className={`overflow-y-auto p-4 ${selectedBlock ? 'h-[35%]' : 'flex-1'}`}>
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return;
            setBlocks(move(blocks, event) as Block[]);
          }}
        >
          <div className="space-y-1.5 max-w-2xl mx-auto">
            {blocks.map((block, index) => (
              <SortableBlock key={block.id} block={block} index={index} />
            ))}
          </div>
        </DragDropProvider>
        {blocks.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">No blocks yet</p>
            <p className="text-sm mt-1">Click a block type in the left panel to add one</p>
          </div>
        )}
      </div>
      {selectedBlock && (
        <div className="h-[65%] border-t border-gray-700 bg-gray-900">
          <BlockEditor block={selectedBlock} />
        </div>
      )}
    </div>
  );
}
