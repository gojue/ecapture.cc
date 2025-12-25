const fs = require('fs');
const path = require('path');

const wikiData = require('./wiki.json');

const outputDir = path.join(__dirname, '../docs');

// Function to convert title to a slug format
function titleToSlug(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
            let content = page.content;
            // Unified link replacement
            const { repo_name, commit_hash } = metadata;
            content = content.replace(/(\[.*?\])\((.*?)\)/g, (match, text, target) => {
                // 1. Handle empty target []() - likely source file reference
                if (!target || target.trim() === '') {
                    // Extract filename from text [filename]
                    // Matches [file] or [file:start] or [file:start-end]
                    const fileMatch = text.match(/^\[([\w\/\.-]+)(?::(\d+)(?:-(\d+))?)?\]$/);
                    if (fileMatch && repo_name && commit_hash) {
                        const file = fileMatch[1];
                        const start = fileMatch[2];
                        const end = fileMatch[3];
                        let lineRange = '';
                        if (start) {
                            lineRange = `#L${start}`;
                            if (end) lineRange += `-L${end}`;
                        }
                        return `${text}(https://github.com/${repo_name}/blob/${commit_hash}/${file}${lineRange})`;
                    }
                    return match;
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
                         // Check for common source file extensions or specific files
                         if (target.match(/\.(md|go|c|h|yml|json|toml|sh|svg|mk|mod|sum)$/) ||
                             target.includes('Dockerfile') ||
                             target.includes('Makefile') ||
                             target === 'LICENSE' ||
                             target === 'CHANGELOG' ||
                             target === 'README' ||
                             target === 'README_CN') {

                             let repoPath = target;
                             // Remove relative path prefixes to get repo-relative path
                             repoPath = repoPath.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
                             return `${text}(https://github.com/${repo_name}/blob/${commit_hash}/${repoPath})`;
                         }
                     }
                }

                return match;
            });
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
    const enPages = wikis.en.pages;
    const idToSlugMap = createIdToSlugMap(enPages);

    for (const lang in wikis) {
        if (Object.hasOwnProperty.call(wikis, lang)) {
            const langDir = path.join(outputDir, lang);
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir, { recursive: true });
            }

            const langData = wikis[lang];
            if (langData.pages) {
                processPages(langData.pages, lang, idToSlugMap, langDir, langData.metadata);
            }
        }
    }

    console.log('Documentation generated successfully in docs directory.');
}

main();

