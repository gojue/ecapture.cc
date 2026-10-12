const fs = require('fs');
const path = require('path');

const wikiData = require('./wiki.json');

const outputDir = path.join(__dirname, '../docs');

// Devin sometimes returns Chinese titles even for the "en" wiki. Keep the
// public URLs readable and stable instead of deriving partial ASCII slugs.
const slugOverrides = {
    '简介': 'start',
    '简介概览': 'overview',
    '使用要求': 'requirements',
    '快速开始': 'quick-start',
    '安装与准备': 'installation-and-prerequisites',
    '最低权限要求': 'minimum-privileges',
    '快速开始：5分钟跑通第一个示例': 'first-capture-in-five-minutes',
    '输出格式（文本 / pcap / keylog）': 'output-formats-text-pcap-keylog',
    '探针功能': 'probe-features',
    'TLS/SSL 明文抓取（OpenSSL / BoringSSL）': 'tls-ssl-plaintext-capture',
    'GoTLS 抓取': 'gotls-capture',
    'GnuTLS 抓取': 'gnutls-capture',
    'NSS / NSPR 抓取': 'nss-nspr-capture',
    '数据库流量抓取（MySQL / PostgreSQL）': 'database-traffic-capture',
    'Shell 审计（Bash / Zsh）': 'shell-auditing',
    '故障排查': 'troubleshooting',
    '检测与防御': 'detection-and-defense',
    '系统架构': 'system-architecture',
    '三层架构': 'three-layer-architecture',
    '探针框架与扩展机制': 'probe-framework-and-extension',
    '事件处理管线': 'event-processing-pipeline',
    '开发者指南': 'developer-guide',
    '编译与构建': 'compilation-and-build',
    '如何新增探针': 'adding-a-new-probe',
    '测试策略与 CI/CD': 'testing-strategy-and-cicd',
    '版本偏移量生成与库版本适配': 'offset-generation-and-library-versions',
    '网络层抓包与进程归属（TC/cgroup 过滤）': 'network-capture-and-process-attribution',
    'eBPF 字节码与内核头文件基础设施': 'ebpf-bytecode-and-kernel-headers',
    '进程与 ELF 符号解析': 'process-and-elf-symbol-resolution',
    '输出写入器与编码器实现': 'output-writers-and-encoders',
    'HTTP / HTTP2 协议解析器': 'http-and-http2-parsers',
    'Protobuf 协议定义与可视化工具': 'protobuf-and-visualization-tools',
    'Wireshark Lua 插件与密钥派生工具': 'wireshark-lua-and-key-derivation',
    'Android 平台支持与端到端测试': 'android-support-and-end-to-end-tests',
    '版本升级与环境自检命令': 'upgrading-and-environment-checks',
    '打包与发布（deb / rpm / Docker）': 'packaging-and-releases',
    '贡献指南与 AI 代理约定': 'contributing-and-ai-agent-conventions',
    'BoringSSL 与 Android 偏移量提取': 'boringssl-and-android-offset-extraction'
};

function isRepoSourceLink(target) {
    const repoPath = target.replace(/^((\.\.\/)+|\.\/)/, '');
    const basename = path.basename(repoPath);

    if (!repoPath || target.startsWith('#')) {
        return false;
    }

    return /\.(md|go|c|h|js|py|bin|yml|yaml|json|toml|sh|lua|svg|mk|mod|sum|proto|spec|png|jpe?g|gif|webp)$/i.test(repoPath) ||
        basename.startsWith('.') ||
        repoPath.includes('Dockerfile') ||
        repoPath.includes('Makefile') ||
        repoPath === 'LICENSE' ||
        repoPath === 'CHANGELOG' ||
        repoPath === 'README' ||
        repoPath === 'README_CN';
}

function sourceReference(label, metadata) {
    const { repo_name, commit_hash } = metadata;
    if (!repo_name || !commit_hash) return null;

    const cleanLabel = label.trim().replace(/\(\)$/, '');
    const location = cleanLabel.match(/^(.+?):(\d+)(?:-(\d+))?(?:,\s*\d+(?:-\d+)?)*$/);
    const file = location ? location[1] : cleanLabel;
    if (!/[a-z]/i.test(file) || !isRepoSourceLink(file)) return null;

    const lines = location ? `#L${location[2]}${location[3] ? `-L${location[3]}` : ''}` : '';
    return `[${cleanLabel}](https://github.com/${repo_name}/blob/${commit_hash}/${file}${lines})`;
}

// Wiki snapshots use several citation formats in Sources blocks, sometimes
// with broken or mismatched Markdown punctuation. Extract file references and
// rebuild these lines before the general link rewrite.
function normalizeSources(content, metadata) {
    let inSourceList = false;
    const references = line => {
        const found = new Map();
        const pattern = /(?:[a-z0-9.$_-]+\/)*[a-z0-9.$_-]+(?::\d+(?:-\d+)?(?:,\s*\d+(?:-\d+)?)*)?/gi;
        for (const match of line.matchAll(pattern)) {
            const link = sourceReference(match[0], metadata);
            if (link) found.set(match[0], link);
        }
        return [...found.values()];
    };
    return content.split('\n').map(line => {
        const sourceLine = /^Sources:\s*/.test(line);
        if (sourceLine) {
            inSourceList = line.trim() === 'Sources:';
        } else if (inSourceList && !/^\s*-\s+/.test(line)) {
            inSourceList = false;
        }
        if (!sourceLine && !inSourceList) return line;

        const links = references(line);
        if (!links.length) return line;
        return `${sourceLine ? 'Sources:' : '-'} ${links.join(', ')}`;
    }).join('\n');
}

// Some Wiki paragraphs wrap one or more source links in inline-code markers.
// Markdown renders those as literal link syntax, so unwrap citation-only code
// spans before the regular link rewrite. Leave code fences and ordinary inline
// code untouched.
function normalizeInlineSourceCitations(content, metadata) {
    let fence = null;
    return content.split('\n').map(line => {
        const delimiter = line.match(/^\s*(`{3,}|~{3,})/);
        if (delimiter) {
            const marker = delimiter[1];
            if (!fence) fence = marker;
            else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
            return line;
        }
        if (fence) return line;

        const unwrapped = line.replace(/`([^`\n]+)`/g, (code, inner) => {
            const citation = /\[([^\]\n]+)\]\(\)/g;
            const matches = [...inner.matchAll(citation)];
            if (!matches.length || inner.replace(citation, '').replace(/[,\s]/g, '')) return code;

            const links = matches.map(match => sourceReference(match[1], metadata));
            if (links.some(link => !link)) return code;

            let index = 0;
            return inner.replace(citation, () => links[index++]);
        });

        // A small number of captions use [file:line] without the empty
        // parentheses. Link those too, but skip existing links and code spans.
        return unwrapped.split(/(`[^`\n]*`)/g).map((part, index) => {
            if (index % 2) return part;
            return part.replace(/(?<!!)\[([\w./-]+:\d+(?:-\d+)?)\](?!\()/g,
                (label, file) => sourceReference(file, metadata) || label);
        }).join('');
    }).join('\n');
}

// Wiki diagrams sometimes contain prose markers that are not Mermaid syntax.
// Repair only the known forms; the validation step rejects anything else.
function normalizeMermaid(content) {
    const lines = content.split('\n');
    let opening = null;

    for (let index = 0; index < lines.length; index++) {
        const marker = lines[index].match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (!marker) continue;
        if (!opening) {
            opening = { index, marker: marker[1][0], length: marker[1].length,
                mermaid: /^mermaid(?:\s|$)/i.test(marker[2].trim()) };
            continue;
        }
        if (marker[1][0] !== opening.marker || marker[1].length < opening.length || marker[2].trim()) continue;
        if (opening.mermaid) {
            const diagram = lines.slice(opening.index + 1, index).map(line =>
                line.replace(/^(\s*)sub-title\s+"([^"]+)"\s*$/, '$1%% $2')
                    .replace(/\[([^\]\n]+:\d+(?:-\d+)?)\]\(\)/g, '[$1]')
                    .replace(/\|([A-Za-z_$][\w.$]*\(\))\|/g, '|"$1"|'));
            for (let lineIndex = 0; lineIndex < diagram.length; lineIndex++) {
                const subcode = diagram[lineIndex].match(/^(\s*)subcode\s+\["([^"]+)"\]\s*$/);
                if (subcode) {
                    const hasEnd = diagram.slice(lineIndex + 1).some(line => /^\s*end\s*$/.test(line));
                    diagram[lineIndex] = hasEnd
                        ? `${subcode[1]}subgraph subcode["${subcode[2]}"]`
                        : `${subcode[1]}%% ${subcode[2]}`;
                    continue;
                }

                const sub = diagram[lineIndex].match(/^(\s*)sub:\s*(.+)$/);
                if (!sub) continue;
                // A pseudo-group after its nodes does not tell us which nodes
                // belong inside it. Keep the flow flat rather than inventing
                // a potentially inaccurate group boundary.
                diagram[lineIndex] = `${sub[1]}%% ${sub[2]}`;
                if (!diagram.some(line => /^\s*subgraph\b/.test(line))) {
                    const endIndex = diagram.findIndex((line, position) =>
                        position > lineIndex && /^\s*end\s*$/.test(line));
                    if (endIndex !== -1) diagram.splice(endIndex, 1);
                }
            }
            lines.splice(opening.index + 1, index - opening.index - 1, ...diagram);
            index = opening.index + diagram.length + 1;
        }
        opening = null;
    }
    return lines.join('\n');
}

function rewriteOutsideFences(content, rewrite) {
    let fence = null;
    return content.split('\n').map(line => {
        const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (marker) {
            if (!fence) fence = { marker: marker[1][0], length: marker[1].length };
            else if (marker[1][0] === fence.marker && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
            return line;
        }
        return fence ? line : rewrite(line);
    }).join('\n');
}

// Function to convert title to a slug format
function titleToSlug(title) {
    if (slugOverrides[title]) return slugOverrides[title];
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug || /[\u3400-\u9fff]/u.test(title)) {
        throw new Error(`Add a slug override for the untranslated title: ${title}`);
    }
    return slug;
}

// Function to create a map from page ID to English slug with ID prefix
function createIdToSlugMap(pages, map = {}) {
    if (!pages) {
        return map;
    }
    pages.forEach(page => {
        if (page.page_plan) {
            const id = page.page_plan.id;
            const slug = titleToSlug(page.page_plan.title);
            // Add ID as prefix to the slug
            map[id] = `${id}-${slug}`;
            if (page.page_plan.page_plan) {
                createIdToSlugMap(page.page_plan.page_plan, map);
            }
        }
    });
    return map;
}

function getFilepath(pageId, idToSlugMap, basePath) {
    const idParts = pageId.split('.');
    let currentPath = basePath;
    let isIndex = false;

    if (idParts.length > 1) {
        const parentId = idParts[0]; // Use the first part of the ID as the parent ID
        const parentSlug = idToSlugMap[parentId];
        if (parentSlug) {
            currentPath = path.join(currentPath, parentSlug);
        }
    } else {
        isIndex = true;
    }

    const slug = idToSlugMap[pageId];
    if (!slug) {
        return;
    }

    if (isIndex) {
        const dirPath = path.join(currentPath, slug);
        return path.join(dirPath, 'index.md');
    }
    return path.join(currentPath, `${slug}.md`);
}

// Recursive function to process pages and create files
function processPages(pages, lang, idToSlugMap, basePath, metadata) {
    if (!pages) {
        return;
    }

    pages.forEach(page => {
        if (!page.page_plan) {
            return;
        }

        const pageId = page.page_plan.id;
        const filePath = getFilepath(pageId, idToSlugMap, basePath);
        if (!filePath) {
            console.warn(`No slug found for ID ${pageId} in lang ${lang}`);
            return;
        }
        const dirName = path.dirname(filePath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }

        if (page.content) {
            let content = normalizeMermaid(normalizeInlineSourceCitations(normalizeSources(page.content, metadata), metadata));
            // Unified link replacement
            const { repo_name, commit_hash } = metadata;
            content = rewriteOutsideFences(content, line => line.replace(/(!?\[[^\]\n]*\])\(([^)\n]*)\)/g, (match, text, target) => {
                // 1. Handle empty target []() - likely source file reference
                if (!target || target.trim() === '') {
                    // Devin occasionally prefixes source labels with a comma.
                    const link = !text.startsWith('!') && sourceReference(text.slice(1, -1).replace(/^,\s*/, ''), metadata);
                    if (link) return link;
                    // A few upstream citations have malformed source labels.
                    // Keep their text without emitting a broken ./ URL.
                    return text;
                }

                // 2. Handle Page IDs (with or without #)
                const cleanTarget = target.startsWith('#') ? target.substring(1) : target;
                const targetFilepath = getFilepath(cleanTarget, idToSlugMap, basePath);
                if (targetFilepath) {
                    const relativePath = path.relative(dirName, targetFilepath);
                    return `${text}(${relativePath})`;
                }

                // 3. Handle source file links (README, main.go, etc.)
                if (!target.match(/^(http|https|mailto):/) && !target.startsWith('#')) {
                     if (repo_name && commit_hash) {
                         // Check for common source file extensions, dotfiles, or specific repo files
                         if (isRepoSourceLink(target)) {

                             let repoPath = target;
                             // Remove relative path prefixes to get repo-relative path
                             repoPath = repoPath.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
                             const url = text.startsWith('!') && /\.(png|jpe?g|gif|webp|svg)$/i.test(repoPath)
                                 ? `https://raw.githubusercontent.com/${repo_name}/${commit_hash}/${repoPath}`
                                 : `https://github.com/${repo_name}/blob/${commit_hash}/${repoPath}`;
                             return `${text}(${url})`;
                         }
                     }
                }

                return match;
            }));
            fs.writeFileSync(filePath, content);
        }

        if (page.page_plan && page.page_plan.page_plan) {
            processPages(page.page_plan.page_plan, lang, idToSlugMap, basePath, metadata);
        }
    });
}


function main() {
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    const wikis = wikiData.wiki.wikis;
    const enPages = wikis.en?.pages || wikis.zh?.pages;
    if (!enPages) throw new Error('wiki.json has no en or zh pages');
    const idToSlugMap = createIdToSlugMap(enPages);

    for (const lang of ['en', 'zh']) {
        const langData = wikis[lang] || wikis.en || wikis.zh;
        if (!wikis[lang]) {
            console.warn(`wiki.json has no ${lang} locale; using ${langData === wikis.en ? 'en' : 'zh'} content for ${lang}.`);
        }
        const langDir = path.join(outputDir, lang);
        fs.mkdirSync(langDir, { recursive: true });
        processPages(langData.pages, lang, idToSlugMap, langDir, langData.metadata);
    }

    console.log('Documentation generated successfully in docs directory.');
}

main();

