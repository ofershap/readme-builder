import { BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';

const APP_URL = 'https://ofershap.github.io/readme-builder/';

const sections = [
  {
    title: 'Start with a Hook, Not a Title',
    content: `Your README has about 3 seconds to convince someone to keep reading. The first line after the project name should answer: "Why should I care?"

**Bad:** "MyLib is a utility library for JavaScript."
**Good:** "Parse, validate, and transform dates in 400 bytes — no Moment, no Luxon, no dependencies."

Lead with the value proposition. What pain does it kill? How small/fast/simple is it? Drop a quick code snippet right in the intro showing the core use case in 3-5 lines.`,
  },
  {
    title: 'Show, Don\'t Tell',
    content: `A demo GIF or screenshot is worth a thousand words of documentation. People scroll past walls of text, but they stop for visuals.

- **For CLI tools:** record a terminal GIF with asciinema or VHS
- **For web apps:** capture a browser demo with Playwright screenshots stitched into a GIF
- **For libraries:** show the code + output side by side

Place the visual right after your hook line, before the feature list. That's the prime real estate.`,
  },
  {
    title: 'Badges Done Right',
    content: `Badges signal project health at a glance. But too many badges create noise. Stick to 3-5 that matter:

1. **npm version** — proves it's published and maintained
2. **CI status** — tests pass, builds work
3. **TypeScript** — signals type safety
4. **License** — MIT/Apache/ISC so people know they can use it
5. **Bundle size** (optional) — if size is a selling point

Avoid vanity badges (code style, "made with love", contributor count on small projects). They dilute the signal.`,
  },
  {
    title: 'The 30-Second Install',
    content: `From landing on your README to running code should take under 30 seconds. The pattern:

\`\`\`bash
npm install your-package
\`\`\`

\`\`\`typescript
import { thing } from 'your-package';
const result = thing({ option: true });
\`\`\`

That's it. No "first, make sure you have Node 18+" preamble. No "clone the repo and build from source." The fastest path from zero to value.`,
  },
  {
    title: 'Structure That Scales',
    content: `Every solid README follows this skeleton:

1. **Title + hook** — name and one-liner value prop
2. **Badges** — 3-5 health signals
3. **Visual** — GIF, screenshot, or diagram
4. **Install** — one command
5. **Quick start** — minimal working example
6. **API reference** — props, options, methods
7. **Contributing** — how to help
8. **License** — keep it short

Use collapsible sections (\`<details>\`) for verbose content like full API docs or advanced config. Keep the main scroll path lean.`,
  },
  {
    title: 'Write for Scanners',
    content: `Developers don't read READMEs — they scan them. Optimize for scanning:

- **Bold key terms** in the first sentence of each section
- Use **tables** for API options instead of nested lists
- Keep paragraphs under 3 sentences
- Use \`code formatting\` for anything technical
- GitHub Alerts (\`> [!TIP]\`, \`> [!WARNING]\`) for callouts that need attention

If someone skimming for 10 seconds can figure out what your project does and how to install it, you've won.`,
  },
  {
    title: 'SEO for GitHub READMEs',
    content: `Your README is indexed by Google, GitHub search, and increasingly by LLMs. Help them find you:

- **Heading hierarchy** — one H1 (project name), H2s for sections, H3s for subsections. Never skip levels.
- **Alt text on images** — describe what the image shows, not just "screenshot"
- **Keywords naturally** — mention the problem domain in the first paragraph. "React hook for form validation" beats "a utility for validating things"
- **FAQ section** — LLMs and Google both love Q&A format. Add a "FAQ" or "Why X?" section answering common questions about your tool vs. alternatives

A well-structured README ranks better than a bare repo with just code.`,
  },
  {
    title: 'Common Mistakes',
    content: `**Too much README:** If your README is 500+ lines, most of it should be in separate docs. Link to a \`/docs\` folder or a docs site.

**No README at all:** A repo with no README gets zero stars, period. Even 10 lines is better than nothing.

**Outdated examples:** If your API changed and the README examples don't work, people will close the tab and never come back. Pin your README examples to real tests when possible.

**"Installation: npm install"** — without showing what to do next. The install command alone is useless. Always pair it with a quick-start snippet.

**Cross-linking everything:** Don't list "Other projects by me" at the bottom. It looks self-promotional and distracts from the project at hand.`,
  },
];

export function Guide() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <a
            href={APP_URL}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Editor
          </a>
          <a
            href="https://github.com/ofershap/readme-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            GitHub
            <ExternalLink size={13} />
          </a>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <BookOpen size={28} className="text-blue-400" />
          <h1 className="text-3xl font-bold text-white">README Best Practices</h1>
        </div>
        <p className="text-gray-400 text-lg mb-12">
          What separates a README that gets stars from one that gets ignored. Practical advice from
          studying hundreds of popular open source projects.
        </p>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <article key={i}>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-baseline gap-3">
                <span className="text-blue-400/60 text-base font-mono">{String(i + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-[15px]">
                {section.content.split('\n\n').map((paragraph, j) => {
                  if (paragraph.startsWith('```')) {
                    const lines = paragraph.split('\n');
                    const lang = lines[0].replace('```', '');
                    const code = lines.slice(1, -1).join('\n');
                    return (
                      <pre key={j} className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-4 overflow-x-auto">
                        <code className="text-sm text-gray-300 font-mono">
                          {lang && <span className="text-gray-500 text-xs block mb-2">{lang}</span>}
                          {code}
                        </code>
                      </pre>
                    );
                  }
                  return (
                    <p key={j} className="mb-4" dangerouslySetInnerHTML={{
                      __html: paragraph
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="text-blue-300 bg-gray-900 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
                        .replace(/\n- /g, '<br/>• ')
                        .replace(/\n(\d+)\. /g, '<br/>$1. ')
                    }} />
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 mb-6">
            Ready to build a README that sells your project?
          </p>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            Open README Builder
            <ArrowLeft size={16} className="rotate-180" />
          </a>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-600">
          <a href="https://github.com/ofershap/readme-builder" className="hover:text-gray-400 transition-colors">
            README Builder
          </a>
          {' · '}
          <a href="https://github.com/ofershap" className="hover:text-gray-400 transition-colors">
            @ofershap
          </a>
        </footer>
      </div>
    </div>
  );
}
