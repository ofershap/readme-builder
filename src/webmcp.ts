import { useStore } from './store';
import { BLOCK_DEFINITIONS } from './blocks/registry';
import { generateMarkdown } from './blocks/markdown';
import type { BlockType } from './types';

type ModelContextLike = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations?: Record<string, unknown>;
    execute: (args: Record<string, string>) => unknown;
  }) => unknown;
};

/**
 * WebMCP (developer.chrome.com/docs/ai/webmcp): expose editor tools to
 * in-browser AI agents via the Imperative API. Feature-detected; a no-op in
 * browsers without WebMCP support.
 */
export function registerWebMcpTools(): void {
  const mc = (document as Document & { modelContext?: ModelContextLike }).modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;
  try {
    mc.registerTool({
      name: 'list_block_types',
      description: 'List the README block types this editor can add.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => ({
        types: BLOCK_DEFINITIONS.map((d) => d.type),
      }),
    });
    mc.registerTool({
      name: 'add_block',
      description: 'Add a block of the given type to the end of the README being edited.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Block type, one of the values from list_block_types',
          },
        },
        required: ['type'],
      },
      execute: ({ type }) => {
        const valid = BLOCK_DEFINITIONS.some((d) => d.type === type);
        if (!valid) return { error: `unknown block type: ${type}` };
        useStore.getState().addBlock(type as BlockType);
        return { added: type, blockCount: useStore.getState().blocks.length };
      },
    });
    mc.registerTool({
      name: 'export_markdown',
      description: 'Export the current README as GitHub-flavored markdown.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => ({
        markdown: generateMarkdown(useStore.getState().blocks),
      }),
    });
  } catch {
    // WebMCP unavailable or registration rejected: stay silent
  }
}
