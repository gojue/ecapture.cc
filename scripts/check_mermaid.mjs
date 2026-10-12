import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

// Mermaid sanitizes flowchart labels while parsing. Give it a DOM before
// loading the module, otherwise valid diagrams fail with DOMPurify errors.
const { window } = new JSDOM('');
globalThis.window = window;
globalThis.document = window.document;
const { default: mermaid } = await import('mermaid');

const roots = process.argv.slice(2);
if (!roots.length) roots.push('docs/en', 'docs/zh');

function markdownFiles(entry) {
    if (!fs.existsSync(entry)) {
        throw new Error(`Path does not exist: ${entry}`);
    }
    if (fs.statSync(entry).isFile()) return entry.endsWith('.md') ? [entry] : [];
    return fs.readdirSync(entry, { withFileTypes: true })
        .flatMap(item => markdownFiles(path.join(entry, item.name)))
        .sort();
}

function mermaidBlocks(file) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    const blocks = [];
    let fence = null;

    for (let index = 0; index < lines.length; index++) {
        const match = lines[index].match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (!match) continue;

        if (!fence) {
            fence = {
                marker: match[1][0],
                length: match[1].length,
                start: index + 1,
                mermaid: /^mermaid(?:\s|$)/i.test(match[2].trim()),
            };
        } else if (match[1][0] === fence.marker &&
            match[1].length >= fence.length && !match[2].trim()) {
            if (fence.mermaid) {
                blocks.push({ line: fence.start, content: lines.slice(fence.start, index).join('\n') });
            }
            fence = null;
        }
    }

    if (fence?.mermaid) {
        blocks.push({ line: fence.start, unclosed: true });
    }
    return blocks;
}

let files;
try {
    files = [...new Set(roots.flatMap(markdownFiles))].sort();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

let checked = 0;
const errors = [];
for (const file of files) {
    for (const block of mermaidBlocks(file)) {
        if (block.unclosed) {
            errors.push(`${file}:${block.line}: Mermaid code fence is not closed`);
            continue;
        }
        checked++;
        try {
            await mermaid.parse(block.content);
        } catch (error) {
            const diagramLine = error.hash?.loc?.first_line;
            const line = block.line + (diagramLine || 1);
            const source = block.content.split('\n')[diagramLine ? diagramLine - 1 : 0]?.trim();
            const detail = error.hash?.token
                ? `unexpected ${error.hash.token}${error.hash.text ? ` (${error.hash.text})` : ''}`
                : error.message.split('\n')[0];
            errors.push(`${file}:${line}: Mermaid syntax error: ${detail}${source ? `\n  ${source}` : ''}`);
        }
    }
}

if (errors.length) {
    console.error(`Found ${errors.length} Mermaid error(s) in ${checked} diagram(s):\n${errors.join('\n')}`);
    process.exitCode = 1;
} else {
    console.log(`Checked ${checked} Mermaid diagram(s) in ${files.length} Markdown file(s): no syntax errors.`);
}
