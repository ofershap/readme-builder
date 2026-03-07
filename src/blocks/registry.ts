import type { BlockDefinition } from '../types';

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'heading',
    label: 'Heading',
    icon: 'Heading',
    defaultProps: { level: 2, text: 'Section Title' },
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: 'AlignLeft',
    defaultProps: { text: 'Your text here...' },
  },
  {
    type: 'code',
    label: 'Code Block',
    icon: 'Code',
    defaultProps: { language: 'typescript', code: '// your code here' },
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'Image',
    defaultProps: { url: '', alt: 'description', width: '' },
  },
  {
    type: 'list',
    label: 'List',
    icon: 'List',
    defaultProps: { style: 'unordered', items: [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }] },
  },
  {
    type: 'table',
    label: 'Table',
    icon: 'Table',
    defaultProps: { headers: ['Column 1', 'Column 2'], rows: [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']] },
  },
  {
    type: 'hr',
    label: 'Divider',
    icon: 'Minus',
    defaultProps: {},
  },
  {
    type: 'blockquote',
    label: 'Blockquote',
    icon: 'Quote',
    defaultProps: { text: 'A meaningful quote or note.' },
  },
  {
    type: 'alert',
    label: 'Alert',
    icon: 'AlertTriangle',
    defaultProps: { type: 'NOTE', text: 'Useful information that users should know.' },
  },
  {
    type: 'badges',
    label: 'Badges',
    icon: 'Award',
    defaultProps: { badges: [], align: 'left' },
  },
  {
    type: 'details',
    label: 'Collapsible',
    icon: 'ChevronDown',
    defaultProps: { summary: 'Click to expand', content: 'Hidden content here...', open: false },
  },
  {
    type: 'centered',
    label: 'Centered',
    icon: 'AlignCenter',
    defaultProps: { content: 'Centered content here' },
  },
  {
    type: 'columns',
    label: 'Columns',
    icon: 'Columns2',
    defaultProps: { columns: [{ content: 'Column 1' }, { content: 'Column 2' }] },
  },
  {
    type: 'buttonRow',
    label: 'Button Row',
    icon: 'RectangleHorizontal',
    defaultProps: { buttons: [{ label: 'Documentation', url: '#docs', color: '0078D4', style: 'for-the-badge' }, { label: 'Demo', url: '#demo', color: '00C853', style: 'for-the-badge' }], align: 'center' },
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: 'MoveVertical',
    defaultProps: { lines: 2 },
  },
  {
    type: 'gitshow',
    label: 'GitShow Card',
    icon: 'CreditCard',
    defaultProps: { username: 'ofershap' },
  },
  {
    type: 'socialLinks',
    label: 'Social Links',
    icon: 'Share2',
    defaultProps: { links: [], align: 'left' },
  },
  {
    type: 'raw',
    label: 'Raw Markdown',
    icon: 'FileText',
    defaultProps: { content: '' },
  },
];
