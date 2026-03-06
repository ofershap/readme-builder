import type { Block, HeadingProps, ParagraphProps, CodeProps, ImageProps, ListProps, TableProps, BlockquoteProps, AlertProps, RawProps, BadgesProps, BadgeConfig, DetailsProps, CenteredProps, ColumnsProps, ButtonRowProps, SpacerProps } from '../types';

function badgeImgUrl(badge: BadgeConfig): string {
  if (badge.preset) return badge.preset;
  let url = `https://img.shields.io/badge/${encodeURIComponent(badge.label)}-${encodeURIComponent(badge.message)}-${encodeURIComponent(badge.color)}`;
  const params: string[] = [];
  if (badge.style && badge.style !== 'flat') params.push(`style=${badge.style}`);
  if (badge.logo) params.push(`logo=${encodeURIComponent(badge.logo)}`);
  if (badge.logoColor) params.push(`logoColor=${encodeURIComponent(badge.logoColor)}`);
  if (badge.labelColor) params.push(`labelColor=${encodeURIComponent(badge.labelColor)}`);
  if (params.length) url += '?' + params.join('&');
  return url;
}

function badgeToMarkdown(badge: BadgeConfig): string {
  const imgUrl = badgeImgUrl(badge);
  const img = `![${badge.label}](${imgUrl})`;
  if (badge.url) return `[${img}](${badge.url})`;
  return img;
}

function blockToMarkdown(block: Block): string {
  switch (block.type) {
    case 'heading': {
      const p = block.props as HeadingProps;
      const hashes = '#'.repeat(p.level);
      const line = `${hashes} ${p.text}`;
      if (p.align && p.align !== 'left') {
        return `<h${p.level} align="${p.align}">${p.text}</h${p.level}>`;
      }
      return line;
    }
    case 'paragraph': {
      const p = block.props as ParagraphProps;
      return p.text;
    }
    case 'code': {
      const p = block.props as CodeProps;
      return '```' + p.language + '\n' + p.code + '\n```';
    }
    case 'image': {
      const p = block.props as ImageProps;
      if (!p.url) return '';
      const img = p.width
        ? `<img src="${p.url}" alt="${p.alt}" width="${p.width}">`
        : `![${p.alt}](${p.url})`;
      if (p.align === 'center') return `<p align="center">${img}</p>`;
      if (p.align === 'right') return `<p align="right">${img}</p>`;
      return img;
    }
    case 'list': {
      const p = block.props as ListProps;
      return p.items.map((item, i) => {
        if (p.style === 'ordered') return `${i + 1}. ${item.text}`;
        if (p.style === 'task') return `- [${item.checked ? 'x' : ' '}] ${item.text}`;
        return `- ${item.text}`;
      }).join('\n');
    }
    case 'table': {
      const p = block.props as TableProps;
      if (!p.headers.length) return '';
      const headerRow = '| ' + p.headers.join(' | ') + ' |';
      const sepRow = '| ' + p.headers.map((_, i) => {
        const align = p.alignments?.[i];
        if (align === 'center') return ':---:';
        if (align === 'right') return '---:';
        return '---';
      }).join(' | ') + ' |';
      const dataRows = p.rows.map(row => '| ' + row.join(' | ') + ' |').join('\n');
      return [headerRow, sepRow, dataRows].filter(Boolean).join('\n');
    }
    case 'hr':
      return '---';
    case 'blockquote': {
      const p = block.props as BlockquoteProps;
      return p.text.split('\n').map(line => `> ${line}`).join('\n');
    }
    case 'alert': {
      const p = block.props as AlertProps;
      return `> [!${p.type}]\n> ${p.text.split('\n').join('\n> ')}`;
    }
    case 'badges': {
      const p = block.props as BadgesProps;
      if (!p.badges.length) return '';
      if (p.align === 'center' || p.align === 'right') {
        const htmlBadges = p.badges.map(badge => {
          const imgUrl = badgeImgUrl(badge);
          const img = `<img src="${imgUrl}" alt="${badge.label}">`;
          return badge.url ? `<a href="${badge.url}">${img}</a>` : img;
        }).join(' ');
        return `<p align="${p.align}">${htmlBadges}</p>`;
      }
      return p.badges.map(badgeToMarkdown).join(' ');
    }
    case 'details': {
      const p = block.props as DetailsProps;
      const openAttr = p.open ? ' open' : '';
      return `<details${openAttr}>\n<summary>${p.summary}</summary>\n\n${p.content}\n\n</details>`;
    }
    case 'centered': {
      const p = block.props as CenteredProps;
      return `<div align="center">\n\n${p.content}\n\n</div>`;
    }
    case 'columns': {
      const p = block.props as ColumnsProps;
      const widthPct = Math.floor(100 / p.columns.length);
      const cells = p.columns.map(col => {
        const w = col.width || `${widthPct}%`;
        return `<td valign="top" width="${w}">\n\n${col.content}\n\n</td>`;
      }).join('\n');
      return `<table>\n<tr>\n${cells}\n</tr>\n</table>`;
    }
    case 'buttonRow': {
      const p = block.props as ButtonRowProps;
      if (!p.buttons.length) return '';
      const align = p.align || 'center';
      const btnMarkup = p.buttons.map(btn => {
        const color = btn.color || '0078D4';
        const style = btn.style || 'for-the-badge';
        const imgUrl = `https://img.shields.io/badge/-${encodeURIComponent(btn.label)}-${encodeURIComponent(color)}?style=${style}${btn.logo ? '&logo=' + encodeURIComponent(btn.logo) + '&logoColor=white' : ''}`;
        if (align === 'center' || align === 'right') {
          return `<a href="${btn.url}"><img src="${imgUrl}" alt="${btn.label}"></a>`;
        }
        return `[![${btn.label}](${imgUrl})](${btn.url})`;
      });
      if (align === 'center' || align === 'right') {
        return `<p align="${align}">${btnMarkup.join(' ')}</p>`;
      }
      return btnMarkup.join(' ');
    }
    case 'spacer': {
      const p = block.props as SpacerProps;
      return Array(p.lines).fill('<br>').join('\n');
    }
    case 'raw': {
      const p = block.props as RawProps;
      return p.content;
    }
    default:
      return '';
  }
}

export function generateMarkdown(blocks: Block[]): string {
  return blocks.map(blockToMarkdown).filter(Boolean).join('\n\n');
}
