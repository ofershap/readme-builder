export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'code'
  | 'image'
  | 'list'
  | 'table'
  | 'hr'
  | 'blockquote'
  | 'alert'
  | 'badges'
  | 'details'
  | 'centered'
  | 'columns'
  | 'buttonRow'
  | 'spacer'
  | 'raw';

export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  align?: 'left' | 'center' | 'right';
}

export interface ParagraphProps {
  text: string;
}

export interface CodeProps {
  language: string;
  code: string;
}

export interface ImageProps {
  url: string;
  alt: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ListProps {
  style: 'unordered' | 'ordered' | 'task';
  items: Array<{ text: string; checked?: boolean }>;
}

export interface TableProps {
  headers: string[];
  rows: string[][];
  alignments?: Array<'left' | 'center' | 'right'>;
}

export interface BlockquoteProps {
  text: string;
}

export interface AlertProps {
  type: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
  text: string;
}

export interface RawProps {
  content: string;
}

export interface BadgeConfig {
  id: string;
  label: string;
  message: string;
  color: string;
  labelColor?: string;
  style: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';
  logo?: string;
  logoColor?: string;
  url?: string;
  preset?: string;
}

export interface BadgesProps {
  badges: BadgeConfig[];
  align: 'left' | 'center' | 'right';
}

export interface DetailsProps {
  summary: string;
  content: string;
  open?: boolean;
}

export interface CenteredProps {
  content: string;
}

export interface ColumnsProps {
  columns: Array<{ content: string; width?: string }>;
}

export interface ButtonRowProps {
  buttons: Array<{ label: string; url: string; color: string; style: 'for-the-badge' | 'flat' | 'flat-square' | 'plastic'; logo?: string }>;
  align: 'left' | 'center' | 'right';
}

export interface SpacerProps {
  lines: number;
}

export type BlockProps =
  | HeadingProps
  | ParagraphProps
  | CodeProps
  | ImageProps
  | ListProps
  | TableProps
  | Record<string, never>
  | BlockquoteProps
  | AlertProps
  | BadgesProps
  | DetailsProps
  | CenteredProps
  | ColumnsProps
  | ButtonRowProps
  | SpacerProps
  | RawProps;

export interface Block {
  id: string;
  type: BlockType;
  props: BlockProps;
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  defaultProps: BlockProps;
}
