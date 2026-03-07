import { X, Package, Wrench, Terminal, User } from 'lucide-react';
import { useStore } from '../store';
import type { Block } from '../types';

let tid = Date.now() + 1000;
const id = () => `tmpl-${tid++}`;

type Template = {
  name: string;
  description: string;
  icon: React.ReactNode;
  blocks: Block[];
};

const TEMPLATES: Template[] = [
  {
    name: 'Minimal Library',
    description: 'Clean README for a small npm package',
    icon: <Package size={20} />,
    blocks: [
      { id: id(), type: 'heading', props: { level: 1, text: 'my-library', align: 'left' } },
      { id: id(), type: 'badges', props: { badges: [
        { id: id(), label: 'npm', message: 'v1.0.0', color: 'red', style: 'flat', logo: 'npm' },
        { id: id(), label: 'TypeScript', message: 'strict', color: 'blue', style: 'flat', logo: 'typescript' },
        { id: id(), label: 'License', message: 'MIT', color: 'yellow', style: 'flat' },
      ], align: 'left' } },
      { id: id(), type: 'paragraph', props: { text: 'One-line description of what this library does.' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Install' } },
      { id: id(), type: 'code', props: { language: 'bash', code: 'npm install my-library' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Usage' } },
      { id: id(), type: 'code', props: { language: 'typescript', code: "import { doSomething } from 'my-library';\n\nconst result = doSomething({ option: true });\nconsole.log(result);" } },
      { id: id(), type: 'heading', props: { level: 2, text: 'API' } },
      { id: id(), type: 'table', props: { headers: ['Option', 'Type', 'Default', 'Description'], rows: [['option', 'boolean', 'false', 'Enable the feature'], ['timeout', 'number', '5000', 'Timeout in ms']] } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Author' } },
      { id: id(), type: 'gitshow', props: { username: 'your-username' } },
      { id: id(), type: 'socialLinks', props: { links: [
        { platform: 'LinkedIn', handle: 'your-username', url: 'https://linkedin.com/in/your-username' },
        { platform: 'GitHub', handle: 'your-username', url: 'https://github.com/your-username' },
      ], align: 'left' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'License' } },
      { id: id(), type: 'paragraph', props: { text: 'MIT' } },
    ],
  },
  {
    name: 'Full Project',
    description: 'Complete README with features, screenshots, contributing',
    icon: <Wrench size={20} />,
    blocks: [
      { id: id(), type: 'centered', props: { content: '# My Project\n\n**A modern tool for doing amazing things**' } },
      { id: id(), type: 'badges', props: { badges: [
        { id: id(), label: 'CI', message: 'passing', color: 'brightgreen', style: 'flat', logo: 'githubactions' },
        { id: id(), label: 'npm', message: 'v1.0.0', color: 'red', style: 'flat', logo: 'npm' },
        { id: id(), label: 'License', message: 'MIT', color: 'yellow', style: 'flat' },
        { id: id(), label: 'TypeScript', message: 'strict', color: 'blue', style: 'flat', logo: 'typescript' },
      ], align: 'center' } },
      { id: id(), type: 'spacer', props: { lines: 1 } },
      { id: id(), type: 'image', props: { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=top', alt: 'Demo', align: 'center', width: '600' } },
      { id: id(), type: 'spacer', props: { lines: 1 } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Features' } },
      { id: id(), type: 'list', props: { style: 'unordered', items: [
        { text: 'Feature one with **bold** highlights' },
        { text: 'Feature two with `code` examples' },
        { text: 'Feature three with [links](https://example.com)' },
      ] } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Quick Start' } },
      { id: id(), type: 'code', props: { language: 'bash', code: 'npm install my-project\nnpx my-project init' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Usage' } },
      { id: id(), type: 'code', props: { language: 'typescript', code: "import { MyProject } from 'my-project';\n\nconst app = new MyProject({\n  debug: true,\n  output: './dist',\n});\n\nawait app.run();" } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Configuration' } },
      { id: id(), type: 'table', props: { headers: ['Option', 'Type', 'Default', 'Description'], rows: [['debug', 'boolean', 'false', 'Enable debug logging'], ['output', 'string', './dist', 'Output directory'], ['workers', 'number', '4', 'Number of parallel workers']] } },
      { id: id(), type: 'details', props: { summary: 'Advanced Configuration', content: 'Additional configuration options can be set via a `.myprojectrc` file in your project root.\n\n```json\n{\n  "extends": "default",\n  "plugins": ["plugin-a"]\n}\n```', open: false } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Contributing' } },
      { id: id(), type: 'paragraph', props: { text: 'Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) before submitting a PR.' } },
      { id: id(), type: 'code', props: { language: 'bash', code: 'git clone https://github.com/user/my-project.git\ncd my-project\nnpm install\nnpm test' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Author' } },
      { id: id(), type: 'gitshow', props: { username: 'your-username' } },
      { id: id(), type: 'socialLinks', props: { links: [
        { platform: 'LinkedIn', handle: 'your-username', url: 'https://linkedin.com/in/your-username' },
        { platform: 'GitHub', handle: 'your-username', url: 'https://github.com/your-username' },
      ], align: 'left' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'License' } },
      { id: id(), type: 'paragraph', props: { text: 'MIT -- see [LICENSE](LICENSE) for details.' } },
    ],
  },
  {
    name: 'CLI Tool',
    description: 'README for a command-line tool with usage examples',
    icon: <Terminal size={20} />,
    blocks: [
      { id: id(), type: 'heading', props: { level: 1, text: 'my-cli' } },
      { id: id(), type: 'paragraph', props: { text: '> A fast CLI tool for doing things from your terminal.' } },
      { id: id(), type: 'badges', props: { badges: [
        { id: id(), label: 'npm', message: 'v1.0.0', color: 'red', style: 'flat', logo: 'npm' },
        { id: id(), label: 'License', message: 'MIT', color: 'yellow', style: 'flat' },
      ], align: 'left' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Install' } },
      { id: id(), type: 'code', props: { language: 'bash', code: 'npm install -g my-cli\n# or use npx\nnpx my-cli --help' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Usage' } },
      { id: id(), type: 'code', props: { language: 'bash', code: '$ my-cli init my-project\n$ my-cli build --output ./dist\n$ my-cli deploy --env production' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Commands' } },
      { id: id(), type: 'table', props: { headers: ['Command', 'Description'], rows: [['init <name>', 'Create a new project'], ['build', 'Build the project'], ['deploy', 'Deploy to production'], ['--help', 'Show help']] } },
      { id: id(), type: 'heading', props: { level: 2, text: 'Author' } },
      { id: id(), type: 'gitshow', props: { username: 'your-username' } },
      { id: id(), type: 'socialLinks', props: { links: [
        { platform: 'LinkedIn', handle: 'your-username', url: 'https://linkedin.com/in/your-username' },
        { platform: 'GitHub', handle: 'your-username', url: 'https://github.com/your-username' },
      ], align: 'left' } },
      { id: id(), type: 'heading', props: { level: 2, text: 'License' } },
      { id: id(), type: 'paragraph', props: { text: 'MIT' } },
    ],
  },
  {
    name: 'GitHub Profile',
    description: 'Personal profile README with about me, stats, links',
    icon: <User size={20} />,
    blocks: [
      { id: id(), type: 'centered', props: { content: '# Hi, I\'m [Your Name] 👋' } },
      { id: id(), type: 'paragraph', props: { text: "I'm a software developer passionate about open source, TypeScript, and building tools that make developers' lives easier." } },
      { id: id(), type: 'heading', props: { level: 2, text: '🔧 Technologies' } },
      { id: id(), type: 'badges', props: { badges: [
        { id: id(), label: 'TypeScript', message: '', color: '3178C6', style: 'for-the-badge', logo: 'typescript', logoColor: 'white' },
        { id: id(), label: 'React', message: '', color: '61DAFB', style: 'for-the-badge', logo: 'react', logoColor: 'black' },
        { id: id(), label: 'Node.js', message: '', color: '339933', style: 'for-the-badge', logo: 'nodedotjs', logoColor: 'white' },
        { id: id(), label: 'Go', message: '', color: '00ADD8', style: 'for-the-badge', logo: 'go', logoColor: 'white' },
      ], align: 'left' } },
      { id: id(), type: 'heading', props: { level: 2, text: '📊 GitHub Stats' } },
      { id: id(), type: 'image', props: { url: 'https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=dark', alt: 'GitHub Stats', align: 'left' } },
      { id: id(), type: 'heading', props: { level: 2, text: '🔗 Connect' } },
      { id: id(), type: 'gitshow', props: { username: 'your-username' } },
      { id: id(), type: 'socialLinks', props: { links: [
        { platform: 'LinkedIn', handle: 'your-username', url: 'https://linkedin.com/in/your-username' },
        { platform: 'X/Twitter', handle: 'your-username', url: 'https://x.com/your-username' },
        { platform: 'Website', handle: 'https://yourblog.dev', url: 'https://yourblog.dev' },
      ], align: 'left' } },
    ],
  },
];

export function TemplateModal({ onClose }: { onClose: () => void }) {
  const setBlocks = useStore(s => s.setBlocks);
  const selectBlock = useStore(s => s.selectBlock);

  const applyTemplate = (template: Template) => {
    const blocks = template.blocks.map(b => ({ ...b, id: `tmpl-${tid++}` }));
    setBlocks(blocks);
    selectBlock(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-[600px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Choose a Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          {TEMPLATES.map(template => (
            <button
              key={template.name}
              onClick={() => applyTemplate(template)}
              className="w-full flex items-start gap-4 p-4 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-blue-500/5 transition-colors text-left cursor-pointer"
            >
              <div className="text-gray-400 mt-0.5 shrink-0">{template.icon}</div>
              <div>
                <div className="text-sm font-medium text-white">{template.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{template.description}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">Applying a template replaces all current blocks.</p>
        </div>
      </div>
    </div>
  );
}
