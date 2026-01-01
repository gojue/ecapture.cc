const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, '../src');
const docsDir = path.join(rootDir, '../docs');
const navFile = path.join(rootDir, '../.vitepress/navigation.json');

// Helper to copy dir recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Helper to delete dir recursively
function removeDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

console.log('Starting migration...');

// 1. Backup files that need to be preserved
const backupItems = [
    {
        name: 'src/zh/download',
        src: path.join(srcDir, 'zh/download'),
        backup: path.join(rootDir, 'temp_zh_download'),
        isDirectory: true
    },
    {
        name: 'src/zh/index.md',
        src: path.join(srcDir, 'zh/index.md'),
        backup: path.join(rootDir, 'temp_zh_index.md'),
        isDirectory: false
    },
    {
        name: 'src/en/download/index.md',
        src: path.join(srcDir, 'en/download/index.md'),
        backup: path.join(rootDir, 'temp_en_download_index.md'),
        isDirectory: false
    },
    {
        name: 'src/zh/usage/',
        src: path.join(srcDir, 'zh/usage/'),
        backup: path.join(rootDir, 'temp_zh_usage'),
        isDirectory: true
    }
];

// Backup files and directories
backupItems.forEach(item => {
    if (fs.existsSync(item.src)) {
        console.log(`Backing up ${item.name}...`);
        if (item.isDirectory) {
            copyDir(item.src, item.backup);
        } else {
            fs.copyFileSync(item.src, item.backup);
        }
        item.exists = true;
    } else {
        item.exists = false;
    }
});

// 2. Clean src
// Keep: download (root), index.md, public
// Remove: develop, examples, guide, tutorial, en, zh
const dirsToRemove = ['develop', 'examples', 'guide', 'tutorial', 'en', 'zh'];
console.log('Cleaning src directory...');
dirsToRemove.forEach(d => {
    const target = path.join(srcDir, d);
    if (fs.existsSync(target)) {
        console.log(`Removing ${target}`);
        removeDir(target);
    }
});

// 3. Copy docs to src
console.log('Copying docs to src...');
if (fs.existsSync(path.join(docsDir, 'en'))) {
    copyDir(path.join(docsDir, 'en'), path.join(srcDir, 'en'));
}
if (fs.existsSync(path.join(docsDir, 'zh'))) {
    copyDir(path.join(docsDir, 'zh'), path.join(srcDir, 'zh'));
}

// 4. Restore backed up files
backupItems.forEach(item => {
    if (item.exists) {
        console.log(`Restoring ${item.name}...`);
        if (item.isDirectory) {
            copyDir(item.backup, item.src);
            removeDir(item.backup);
        } else {
            const dir = path.dirname(item.src);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.copyFileSync(item.backup, item.src);
            fs.unlinkSync(item.backup);
        }
    }
});

// 5. Generate Nav
function getTitle(filePath) {
    if (!fs.existsSync(filePath)) return null;
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Match first H1
        const match = content.match(/^#\s+(.*)$/m);
        if (match) {
            return match[1].trim();
        }
        // Match frontmatter title
        const fmMatch = content.match(/^title:\s+(.*)$/m);
        if (fmMatch) {
            return fmMatch[1].trim();
        }
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
    }
    return path.basename(filePath, '.md');
}

function getFirstWordOfTitle(filePath) {
    const title = getTitle(filePath);
    if (title) {
        return title.split(' ')[0];
    }
    return null;
}

function generateNav(lang) {
    const langDir = path.join(srcDir, lang);
    if (!fs.existsSync(langDir)) return [];

    const items = [];
    const entries = fs.readdirSync(langDir, { withFileTypes: true });

    for (let entry of entries) {
        if (entry.isDirectory()) {
            const indexPath = path.join(langDir, entry.name, 'index.md');
            if (fs.existsSync(indexPath)) {
                titleWord = getFirstWordOfTitle(indexPath);
                if (titleWord) {
                    if (lang === 'zh') {
                        if (entry.name === 'download') {
                            titleWord = '下载';
                        }
                        tmpTitles = entry.name.split('与')
                        if (tmpTitles.length > 1) {
                            titleWord = tmpTitles[0];
                        }
                    }
                    items.push({
                        text: titleWord,
                        link: `/${lang}/${entry.name}/index`,
                        dirName: entry.name
                    });
                } else {
                    // Fallback to directory name capitalized if no title found
                    items.push({
                        text: entry.name.charAt(0).toUpperCase() + entry.name.slice(1),
                        link: `/${lang}/${entry.name}/index`,
                        dirName: entry.name
                    });
                }
            }
        }
    }

    // Sort items by numeric prefix if present, otherwise alphabetically
    items.sort((a, b) => {
        // Extract numeric prefix from directory name (e.g., "1-overview" -> 1)
        const getNumericPrefix = (dirName) => {
            const match = dirName.match(/^(\d+)-/);
            return match ? parseInt(match[1], 10) : null;
        };

        const aNum = getNumericPrefix(a.dirName);
        const bNum = getNumericPrefix(b.dirName);

        // If both have numeric prefixes, sort by number
        if (aNum !== null && bNum !== null) {
            return aNum - bNum;
        }

        // If only one has a numeric prefix, put it first
        if (aNum !== null) return -1;
        if (bNum !== null) return 1;

        // If neither has a numeric prefix, sort alphabetically by text
        return a.text.localeCompare(b.text);
    });

    // Remove dirName property before returning (only needed for sorting)
    items.forEach(item => delete item.dirName);

    return items;
}

function generateSidebar(lang) {
    const langDir = path.join(srcDir, lang);
    if (!fs.existsSync(langDir)) return {};

    const sidebar = {};
    const subdirs = fs.readdirSync(langDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory());

    for (let subdir of subdirs) {
        const dirPath = path.join(langDir, subdir.name);
        const files = fs.readdirSync(dirPath)
            .filter(file => file.endsWith('.md'));

        const items = [];
        for (let file of files) {
            const filePath = path.join(dirPath, file);
            const title = getTitle(filePath);
            const link = `/${lang}/${subdir.name}/${file.replace(/\.md$/, '')}`;
            items.push({ text: title, link });
        }

        // Sort items: index.md first, then others alphabetically
        items.sort((a, b) => {
            if (a.link.endsWith('/index')) return -1;
            if (b.link.endsWith('/index')) return 1;
            return a.text.localeCompare(b.text);
        });

        const key = `/${lang}/${subdir.name}/`;
        // Use the directory name or index.md title as the group text
        const indexFile = path.join(dirPath, 'index.md');
        const groupTitle = getTitle(indexFile) || subdir.name;

        sidebar[key] = [
            {
                text: groupTitle,
                items: items
            }
        ];
    }
    return sidebar;
}

console.log('Generating navigation...');
const navEn = generateNav('en');
// Add custom links for English
navEn.push({
        text: 'Projects',
        items: [
            { text: 'eCapture', link: 'https://github.com/gojue/ecapture'},
            { text: 'eBPFManager', link: 'https://github.com/gojue/ebpfmanager'},
            { text: 'eBPFSlide', link: 'https://github.com/gojue/ebpf-slide'},
            { text: 'eHIDSAgent', link: 'https://github.com/gojue/ehids-agent'}
        ]
    },
    {
        text: 'BLOG',
        link: 'https://www.cnxct.com'
    });

const navZh = generateNav('zh');
// Add custom links for Chinese
navZh.push({
        text: '其他项目',
        items: [
            { text: 'eBPFManager', link: 'https://github.com/gojue/ebpfmanager'},
            { text: 'eBPF幻灯片', link: 'https://github.com/gojue/ebpf-slide'},
            { text: 'eHIDSAgent', link: 'https://github.com/gojue/ehids-agent'},
            { text: 'eCapture旁观者', link: 'https://github.com/gojue/ecapture'}
        ]
    },
    {
        text: '作者博客',
        link: 'https://www.cnxct.com'
    });

console.log('Generating sidebar...');
const sidebarEn = generateSidebar('en');
const sidebarZh = generateSidebar('zh');
const fullSidebar = { ...sidebarEn, ...sidebarZh };

// 6. Update navigation.json
console.log('Updating navigation.json...');
// const navConfig = JSON.parse(fs.readFileSync(navFile, 'utf-8'));
let navConfig = {}
// Ensure nav object exists
if (!navConfig.nav) navConfig.nav = {};

navConfig.nav.en = navEn;
navConfig.nav.zh = navZh;
navConfig.sidebar = fullSidebar;

fs.writeFileSync(navFile, JSON.stringify(navConfig, null, 2));

// Update sidebar.json if it exists
const sidebarFile = path.join(rootDir, '../.vitepress/sidebar.json');
fs.writeFileSync(sidebarFile, JSON.stringify(fullSidebar, null, 2));

console.log('Migration completed.');
