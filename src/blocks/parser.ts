import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Block, BlockProps } from '../types';
import type { Root, RootContent, PhrasingContent, Blockquote, Paragraph, List, ListItem, Table, TableRow, TableCell, Html } from 'mdast';

const ALERT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;

interface Phrasing { type: string; value?: string; url?: string; alt?: string; children?: PhrasingContent[] }

function genId(): string {
  return crypto.randomUUID();
}

function inlineToMarkdown(nodes: PhrasingContent[]): string {
  return nodes.map((node): string => {
    const n = node as Phrasing;
    switch (n.type) {
      case 'text':
        return n.value ?? '';
      case 'strong':
        return '**' + inlineToMarkdown(n.children ?? []) + '**';
      case 'emphasis':
        return '*' + inlineToMarkdown(n.children ?? []) + '*';
      case 'inlineCode':
        return '`' + (n.value ?? '') + '`';
      case 'link':
        return '[' + inlineToMarkdown(n.children ?? []) + '](' + (n.url ?? '') + ')';
      case 'delete':
        return '~~' + inlineToMarkdown(n.children ?? []) + '~~';
      case 'image':
        return '![' + (n.alt ?? '') + '](' + (n.url ?? '') + ')';
      case 'html':
        return n.value ?? '';
      case 'break':
        return '\n';
      case 'linkReference':
      case 'imageReference':
        return inlineToMarkdown(n.children ?? []);
      case 'footnoteReference':
        return '';
      default: {
        const fallback = node as unknown as { children?: PhrasingContent[] };
        return fallback.children ? inlineToMarkdown(fallback.children) : '';
      }
    }
  }).join('');
}

function getTableCellText(cell: TableCell): string {
  return inlineToMarkdown(cell.children);
}

function isAlertBlockquote(node: Blockquote): { type: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION'; text: string } | null {
  const first = node.children[0];
  if (!first || first.type !== 'paragraph') return null;
  const para = first as Paragraph;
  const firstChild = para.children[0];
  if (!firstChild || firstChild.type !== 'text') return null;
  const text = (firstChild as { value?: string }).value ?? '';
  const match = text.match(ALERT_REGEX);
  if (!match) return null;
  const alertType = match[1].toUpperCase() as 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
  const afterLabel = text.replace(ALERT_REGEX, '').replace(/^\s*\n?/, '');
  const firstParaRest = [afterLabel, ...para.children.slice(1).map(c => inlineToMarkdown([c]))].filter(Boolean).join('');
  const otherParas = node.children.slice(1).map(p => {
    if (p.type === 'paragraph') return inlineToMarkdown((p as Paragraph).children);
    return '';
  }).filter(Boolean);
  const fullText = [firstParaRest, ...otherParas].filter(Boolean).join('\n\n').trim();
  return { type: alertType, text: fullText };
}

function parseHtmlBlock(html: Html): Block[] {
  const content = html.value?.trim() ?? '';
  const detailsMatch = content.match(/<details(?:\s[^>]*)?>([\s\S]*?)<\/details>/i);
  if (detailsMatch) {
    const inner = detailsMatch[1];
    const summaryMatch = inner.match(/<summary>([\s\S]*?)<\/summary>/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Details';
    const open = /<details\s[^>]*open/i.test(content);
    const detailContent = summaryMatch ? inner.replace(/<summary>[\s\S]*?<\/summary>/i, '').trim() : inner.trim();
    return [{ id: genId(), type: 'details', props: { summary, content: detailContent, open } }];
  }
  const divCenterMatch = content.match(/<div\s+align="center"([^>]*)>([\s\S]*?)<\/div>/i);
  if (divCenterMatch) {
    return [{ id: genId(), type: 'centered', props: { content: divCenterMatch[2].trim() } }];
  }
  const pAlignMatch = content.match(/<p\s+align="(center|left|right)"([^>]*)>([\s\S]*?)<\/p>/i);
  if (pAlignMatch) {
    const align = pAlignMatch[1].toLowerCase() as 'left' | 'center' | 'right';
    const inner = pAlignMatch[3].trim();
    const imgMatch = inner.match(/<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/i) || inner.match(/<img\s+[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/i);
    if (imgMatch) {
      const src = imgMatch[1];
      const alt = imgMatch[2];
      const wMatch = inner.match(/width="([^"]*)"/i);
      return [{ id: genId(), type: 'image', props: { url: src, alt, align, width: wMatch?.[1] } }];
    }
    return [{ id: genId(), type: 'paragraph', props: { text: inner } }];
  }
  const hAlignMatch = content.match(/<h([1-6])\s+align="(center|left|right)"([^>]*)>([\s\S]*?)<\/h\1>/i);
  if (hAlignMatch) {
    const level = parseInt(hAlignMatch[1], 10) as 1 | 2 | 3 | 4 | 5 | 6;
    const align = hAlignMatch[2].toLowerCase() as 'left' | 'center' | 'right';
    return [{ id: genId(), type: 'heading', props: { level, text: hAlignMatch[4].trim(), align } }];
  }
  return [{ id: genId(), type: 'raw', props: { content } }];
}

function nodeToBlocks(node: RootContent): Block[] {
  switch (node.type) {
    case 'heading': {
      const text = inlineToMarkdown(node.children);
      return [{ id: genId(), type: 'heading', props: { level: node.depth, text } }];
    }
    case 'paragraph': {
      const allImages = node.children.every(c => c.type === 'image');
      if (allImages && node.children.length > 0) {
        return node.children.filter(c => c.type === 'image').map(c => {
          const img = c as unknown as { url?: string; alt?: string };
          return {
            id: genId(),
            type: 'image' as const,
            props: { url: img.url ?? '', alt: img.alt ?? '', width: undefined, align: undefined } as BlockProps,
          };
        });
      }
      const text = inlineToMarkdown(node.children);
      return [{ id: genId(), type: 'paragraph', props: { text } }];
    }
    case 'code':
      return [{ id: genId(), type: 'code', props: { language: node.lang ?? '', code: node.value ?? '' } }];
    case 'list': {
      const listNode = node as List;
      const hasTask = listNode.children.some((c: ListItem) => c.checked !== undefined && c.checked !== null);
      const style = hasTask ? 'task' : listNode.ordered ? 'ordered' : 'unordered';
      const items = listNode.children.map((li: ListItem) => ({
        text: li.children.map(c => c.type === 'paragraph' ? inlineToMarkdown((c as Paragraph).children) : '').join('').trim(),
        checked: li.checked ?? undefined
      }));
      return [{ id: genId(), type: 'list', props: { style, items } }];
    }
    case 'table': {
      const tableNode = node as Table;
      const rows = tableNode.children as TableRow[];
      if (rows.length === 0) return [{ id: genId(), type: 'raw', props: { content: '' } }];
      const headers = rows[0].children.map(getTableCellText);
      const dataRows = rows.slice(1).map(row => row.children.map(getTableCellText));
      const alignments = tableNode.align?.map(a => a === 'center' ? 'center' as const : a === 'right' ? 'right' as const : 'left' as const);
      return [{ id: genId(), type: 'table', props: { headers, rows: dataRows, alignments } }];
    }
    case 'thematicBreak':
      return [{ id: genId(), type: 'hr', props: {} }];
    case 'blockquote': {
      const bq = node as Blockquote;
      const alert = isAlertBlockquote(bq);
      if (alert) {
        return [{ id: genId(), type: 'alert', props: { type: alert.type, text: alert.text } }];
      }
      const lines = bq.children.map(c => {
        if (c.type === 'paragraph') return inlineToMarkdown((c as Paragraph).children);
        return '';
      }).filter(Boolean);
      return [{ id: genId(), type: 'blockquote', props: { text: lines.join('\n\n') } }];
    }
    case 'html':
      return parseHtmlBlock(node as Html);
    case 'definition':
    case 'footnoteDefinition':
    case 'yaml':
      return [];
    default:
      return [{ id: genId(), type: 'raw', props: { content: JSON.stringify(node) } }];
  }
}

export function parseMarkdownToBlocks(markdown: string): Block[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown) as Root;

  const blocks: Block[] = [];
  for (const child of tree.children) {
    blocks.push(...nodeToBlocks(child));
  }
  return blocks;
}
