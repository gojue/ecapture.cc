import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

// Read-only checks. Do not run the Wiki migration or modify the build to pass.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(root, relative));
const requiredSlugs = ['', 'quick-start', 'data-sources', 'authentication', 'interface', 'protocols', 'download', 'install', 'faq'];
const sourceOnly = process.argv.includes('--source-only');
assert(process.argv.slice(2).every(arg => arg === '--source-only'), 'Only --source-only is supported');
const errors = [];
const check = (label, action) => {
  try { action(); } catch (error) { errors.push(`${label}: ${error.message}`); }
};

function markdownFiles(directory) {
  return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const relative = `${directory}/${entry.name}`;
    return entry.isDirectory() ? markdownFiles(relative) : entry.name.endsWith('.md') ? [relative] : [];
  }).sort();
}
const pages = {};
for (const locale of ['en', 'zh']) {
  check(`${locale} product pages`, () => {
    pages[locale] = markdownFiles(`src/q/${locale}`);
    const slugs = pages[locale].map(file => file.replace(`src/q/${locale}/`, '').replace(/(?:^|\/)index\.md$/, ''));
    assert.deepEqual(slugs.sort(), [...requiredSlugs].sort(), 'Expected the overview and eight directory-based documents');
  });
}
for (const slug of requiredSlugs) {
  const prefix = slug ? `${slug}/` : '';
  const files = ['en', 'zh'].map(locale => `src/q/${locale}/${prefix}index.md`);
  check(`paired headings ${slug || 'overview'}`, () => {
    const headings = files.map(file => [...read(file).matchAll(/^#{2,4}\s+.*$/gm)].map(match => {
      const id = match[0].match(/\{#([a-z0-9-]+)\}\s*$/)?.[1];
      assert(id, `${file}: use a stable explicit {#anchor} on ${match[0]}`);
      return id;
    }));
    assert.deepEqual(headings[0], headings[1], 'English and Chinese heading IDs differ');
    assert.equal(new Set(headings[0]).size, headings[0].length, 'Duplicate heading ID');
  });
}
check('manual navigation', () => {
  const navigation = read('.vitepress/productNavigation.ts');
  const pageArray = navigation.match(/productPages\s*=\s*\[([\s\S]*?)\]\s*as const/)?.[1];
  assert(pageArray, 'Expected the hand-maintained productPages manifest');
  const slugs = [...pageArray.matchAll(/\[\s*'([^']*)'/g)].map(match => match[1]);
  assert.deepEqual(slugs, requiredSlugs);
  assert(navigation.includes("'/q/en/'") && navigation.includes("'/q/zh/'"), 'Missing dedicated product sidebars');
  const config = read('.vitepress/config.mts');
  assert(config.includes("from './productNavigation'"), 'Config must compose the manual manifest');
  const menuOrder = /\{\s*text:\s*'(?:Download|下载)',\s*link:\s*'\/(?:en|zh)\/download\/'\s*\},\s*productNav\('(en|zh)'\),\s*\{\s*text:\s*'Docker Hub'/g;
  assert.equal([...config.matchAll(menuOrder)].length, 4, 'Product entry must immediately follow Download in all four locales');
  assert(/ignoreDeadLinks:\s*false/.test(config), 'Do not disable dead-link checking');
  const migration = read('scripts/migrate_docs.js');
  const removed = migration.match(/const dirsToRemove\s*=\s*\[([^\]]+)\]/)?.[1];
  assert(removed && !/['"]q['"]/.test(removed), 'Wiki migration must preserve src/q');
  assert(!/writeFileSync\([^\n]*productNavigation/.test(migration), 'Wiki must not generate the manual product manifest');
});
check('dynamic downloads and separate installation', () => {
  for (const locale of ['en', 'zh']) {
    const download = read(`src/q/${locale}/download/index.md`);
    assert(download.includes('<ReleaseDownloads product="ecaptureQ" />'), 'Q downloads must use the shared API release component');
    assert(!/qReleaseAssets|qRelease|releases\/download\/v[0-9]/.test(download), 'Do not hard-code release assets on the dynamic download page');
    assert(download.includes(`/q/${locale}/install/`), 'Download page must link to installation');
    assert(read(`src/q/${locale}/install/index.md`).includes(`/q/${locale}/download/`), 'Installation must link to current downloads');
  }
});
check('local product images', () => {
  const references = new Set();
  for (const file of [...(pages.en || []), ...(pages.zh || []), 'src/q/index.md', '.vitepress/theme/components/EcaptureQIntro.vue', '.vitepress/theme/components/QRelationship.vue']) {
    for (const match of read(file).matchAll(/\/assets\/q\/[^\s"'<>`)]+\.(?:png|webp|jpg|svg)/g)) references.add(match[0]);
  }
  assert(references.size >= 3, 'Overview, sources and protocol-detail screenshots must be referenced');
  for (const reference of references) assert(exists(`src/public${reference}`), `Missing local image ${reference}`);
  assert(exists('src/public/assets/q/README.txt'), 'Missing screenshot provenance');
});

if (!sourceOnly) {
  const documentCache = new Map();
  function outputFile(urlPath) {
    const relative = decodeURIComponent(urlPath).replace(/^\//, '');
    const candidates = urlPath.endsWith('/')
      ? [`dist/${relative}index.html`]
      : [`dist/${relative}`, `dist/${relative}.html`, `dist/${relative}/index.html`];
    return candidates.find(candidate => exists(candidate) && fs.statSync(path.join(root, candidate)).isFile());
  }
  function documentAt(urlPath) {
    const file = outputFile(urlPath);
    assert(file, `Missing built destination ${urlPath}`);
    assert(file.endsWith('.html'), `${urlPath} is not an HTML document`);
    if (!documentCache.has(file)) documentCache.set(file, new JSDOM(read(file)).window.document);
    return documentCache.get(file);
  }
  const routes = ['/q/', ...['en', 'zh'].flatMap(locale => requiredSlugs.map(slug => `/q/${locale}/${slug ? `${slug}/` : ''}`))];
  for (const route of routes) check(`production ${route}`, () => {
    const document = documentAt(route);
    assert.equal(document.documentElement.lang, route.startsWith('/q/zh/') ? 'zh-CN' : 'en-US');
    assert(document.title.includes('eCaptureQ'), 'Product title missing');
    assert(document.querySelector('h1')?.textContent?.trim(), 'Missing product/article heading');
    const nav = document.querySelector('.VPNavBarMenu');
    assert(nav, 'Missing primary navigation');
    const children = [...nav.children].filter(element => !element.classList.contains('visually-hidden'));
    const downloadIndex = children.findIndex(element => /^(?:Download|下载)$/.test(element.textContent.trim()));
    assert(downloadIndex >= 0, 'Download link missing');
    assert(children[downloadIndex + 1]?.textContent.includes('eCaptureQ'), 'Product must follow Download');
    assert(children[downloadIndex + 2]?.textContent.includes('Docker Hub'), 'Docker Hub must follow product');
    for (const image of document.querySelectorAll('main img')) assert(image.getAttribute('alt')?.trim(), 'Content image is missing alt text');
    for (const element of document.querySelectorAll('a[href], img[src], script[src], link[href], source[src]')) {
      const raw = element.getAttribute('href') || element.getAttribute('src');
      if (!raw || /^(?:data:|mailto:|tel:|javascript:)/.test(raw)) continue;
      assert(!raw.includes('**'), `Markdown emphasis leaked into destination ${raw}`);
      const url = new URL(raw, `https://product-check.invalid${route}`);
      if (url.origin !== 'https://product-check.invalid') continue;
      assert(!/^\/(?:en\/q|zh\/q|ecaptureq)(?:\/|$)/.test(url.pathname), `Invalid product path ${raw}`);
      const target = outputFile(url.pathname);
      assert(target, `Missing local destination ${raw}`);
      if (url.hash && target.endsWith('.html')) {
        const id = decodeURIComponent(url.hash.slice(1));
        assert(documentAt(url.pathname).getElementById(id), `Missing anchor ${raw}`);
      }
    }
  });
  for (const slug of requiredSlugs) check(`built heading parity ${slug || 'overview'}`, () => {
    const ids = ['en', 'zh'].map(locale => [...documentAt(`/q/${locale}/${slug ? `${slug}/` : ''}`).querySelectorAll('main h2[id], main h3[id], main h4[id]')].map(element => element.id));
    assert.deepEqual(ids[0], ids[1], 'Rendered article heading IDs differ');
  });
  check('unprefixed entry', () => assert.equal(outputFile('/q'), outputFile('/q/')));
}

if (errors.length) {
  console.error(`Product documentation checks failed (${errors.length}):\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Product documentation checks passed: ${requiredSlugs.length} paired pages, stable navigation, images${sourceOnly ? '' : `, ${1 + 2 * requiredSlugs.length} production routes and local destinations`}.`);
}
