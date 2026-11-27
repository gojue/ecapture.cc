import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { resolveUserConfig } from 'vitepress';

// Read-only checks. Do not run the Wiki migration or modify the build to pass.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(root, relative));
const products = [
  { prefix: 'q', name: 'eCaptureQ', manifest: 'productPages', slugs: ['', 'quick-start', 'data-sources', 'authentication', 'interface', 'protocols', 'download', 'install', 'faq'] },
  { prefix: 'decryptor', name: 'eCapture Decryptor', manifest: 'decryptorPages', slugs: ['', 'quick-start', 'api', 'streaming', 'protocols', 'native'] },
];
const locales = ['en', 'zh'];
const articlePath = (product, locale, slug) => `/${product.prefix}/${locale}/${slug ? slug + '/' : ''}`;
const primaryLabels = zh => ['eCapture', 'eCaptureQ', 'eCapture Decryptor', zh ? '下载' : 'Download', zh ? '作者博客' : 'Blog'];
const routes = ['/', '/zh/', '/en/overview/', '/zh/overview/', '/en/download/', '/zh/download/',
  ...products.flatMap(product => [`/${product.prefix}/`, ...locales.flatMap(locale => product.slugs.map(slug => articlePath(product, locale, slug)))])];
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
const [config] = await resolveUserConfig(root, 'build', 'production');
for (const product of products) {
  for (const locale of locales) {
    check(`${product.prefix}/${locale} product pages`, () => {
      const directory = `src/${product.prefix}/${locale}`;
      const expected = product.slugs.map(slug => `${directory}/${slug ? slug + '/' : ''}index.md`);
      assert.deepEqual(markdownFiles(directory), expected.sort(), 'Expected paired directory-based documents');
    });
  }
  for (const slug of product.slugs) {
    check(`paired headings ${product.prefix}/${slug || 'overview'}`, () => {
      const headings = locales.map(locale => {
        const file = `src${articlePath(product, locale, slug)}index.md`;
        return [...read(file).matchAll(/^#{2,4}\s+.*$/gm)].map(match => {
          const id = match[0].match(/\{#([a-z0-9-]+)\}\s*$/)?.[1];
          assert(id, `${file}: use a stable explicit {#anchor} on ${match[0]}`);
          return id;
        });
      });
      assert.deepEqual(headings[0], headings[1], 'English and Chinese heading IDs differ');
      assert.equal(new Set(headings[0]).size, headings[0].length, 'Duplicate heading ID');
    });
  }
}
check('manual navigation', () => {
  const navigation = read('.vitepress/productNavigation.ts');
  assert(read('.vitepress/config.mts').includes("from './productNavigation'"), 'Config must compose the manual manifest');
  assert.equal(config.ignoreDeadLinks, false, 'Do not disable dead-link checking');
  assert.equal(config.themeConfig.search.provider, 'local');
  for (const product of products) {
    const pageArray = navigation.match(new RegExp(product.manifest + '\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const'))?.[1];
    assert(pageArray, `Expected the hand-maintained ${product.manifest} manifest`);
    const slugs = [...pageArray.matchAll(/\[\s*'([^']*)'/g)].map(match => match[1]);
    assert.deepEqual(slugs, product.slugs);
    for (const locale of locales) {
      const key = `${product.prefix}/${locale}`;
      const localized = config.locales[key];
      assert.equal(localized.link, `/${key}/`);
      assert.equal(localized.lang, locale === 'zh' ? 'zh-CN' : 'en-US');
      assert(localized.themeConfig.sidebar[`/${key}/`], 'Missing product sidebar');
      if (locale === 'zh') assert(config.themeConfig.search.options.locales[key].translations.button.buttonText, 'Missing Chinese search UI');
    }
  }
  for (const [key, locale] of Object.entries(config.locales)) {
    const zh = locale.lang === 'zh-CN';
    assert.deepEqual(locale.themeConfig.nav.map(item => item.text), primaryLabels(zh), `Unexpected navigation for ${key}`);
    assert.deepEqual(locale.themeConfig.nav, config.locales[zh ? 'zh' : 'root'].themeConfig.nav, 'Every locale must share the localized primary navigation');
  }
  const migration = read('scripts/migrate_docs.js');
  const removed = migration.match(/const dirsToRemove\s*=\s*\[([^\]]+)\]/)?.[1];
  assert(removed && !/['"](?:q|decryptor)['"]/.test(removed), 'Wiki migration must preserve product directories');
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
  for (const file of [...markdownFiles('src/q/en'), ...markdownFiles('src/q/zh'), 'src/q/index.md', '.vitepress/theme/components/EcaptureQIntro.vue', '.vitepress/theme/components/QRelationship.vue']) {
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
  for (const route of routes) check(`production ${route}`, () => {
    const document = documentAt(route);
    const zh = route.split('/').includes('zh');
    const locale = zh ? 'zh' : 'en';
    const product = products.find(item => route.startsWith(`/${item.prefix}/`));
    assert.equal(document.documentElement.lang, zh ? 'zh-CN' : 'en-US');
    if (product) assert(document.title.includes(product.name), 'Product title missing');
    assert(document.querySelector('h1')?.textContent?.trim(), 'Missing product/article heading');
    const nav = document.querySelector('.VPNavBarMenu');
    assert(nav, 'Missing primary navigation');
    const children = [...nav.children].filter(element => !element.classList.contains('visually-hidden'));
    const labels = children.map(element => element.querySelector('.nav-dropdown-trigger')?.textContent.replace('⌄', '').trim() || element.textContent.trim());
    assert.deepEqual(labels, primaryLabels(zh));
    assert.equal(children[4].getAttribute('href'), 'https://www.cnxct.com');
    const links = element => [...element.querySelectorAll('.nav-dropdown-links a')].map(link => link.getAttribute('href'));
    assert.equal(children[0].querySelector('.nav-dropdown-link')?.getAttribute('href'), `/${locale}/overview/`);
    const generated = JSON.parse(read('.vitepress/navigation.json'));
    const collectorChapters = Object.keys(generated.sidebar).filter(path => path.startsWith(`/${locale}/`) && !/\/(?:download|overview)\//.test(path));
    assert.deepEqual(links(children[0]), [`/${locale}/overview/`, ...collectorChapters], 'Collector menu must retain every chapter once');
    for (const [index, item] of products.entries()) {
      const menu = children[index + 1];
      assert.equal(menu.querySelector('.nav-dropdown-link')?.getAttribute('href'), articlePath(item, locale, ''));
      const expected = item.slugs.filter(slug => slug !== 'download').map(slug => articlePath(item, locale, slug));
      if (item.prefix === 'q') expected.push('https://ecapture.loongfans.cn/');
      assert.deepEqual(links(menu), expected, `${item.name} documentation menu`);
      if (product === item && !route.endsWith('/download/')) {
        const sidebarLinks = [...document.querySelectorAll('.VPSidebarGroup a')].map(link => link.getAttribute('href'));
        assert.deepEqual(sidebarLinks, expected, 'Product sidebar must match the documentation menu');
        const context = document.querySelector('.ec-doc-context nav a:last-child');
        assert.equal(context?.textContent, product.name, 'Wrong product breadcrumb');
        assert.equal(context.getAttribute('href'), route === `/${product.prefix}/` ? route : articlePath(product, locale, ''));
      }
    }
    assert.deepEqual(links(children[3]), [`/${locale}/download/`, `/q/${locale}/download/`]);
    if (product?.prefix === 'decryptor') {
      assert.equal(document.querySelector('.ec-other-chapters a')?.getAttribute('href'), 'https://github.com/gojue/ecapture_decryptor');
      assert.equal(document.querySelector('.ec-doc-footer .license')?.textContent.trim(), zh ? '本站采用 MIT 许可证。' : 'This website is licensed under the MIT License.');
    }
    assert(!nav.querySelector('a[href*="hub.docker.com"]'), 'Docker Hub belongs on the collector download page');
    if (/^\/(en|zh)\/download\/$/.test(route)) {
      assert(document.querySelector('main a[href="https://hub.docker.com/r/gojue/ecapture"]'), 'Missing Docker Hub download entry');
    }
    if (/\/download\/$/.test(route)) {
      const productName = route.startsWith('/q/') ? 'eCaptureQ' : 'eCapture';
      const downloadTitle = `${productName} ${zh ? '下载' : 'Download'}`;
      assert.equal(document.querySelector('.ec-doc-context nav a:last-child')?.textContent, downloadTitle);
      assert.equal(document.querySelector('.ec-doc-context .ec-eyebrow')?.textContent, downloadTitle);
      const extraLinks = [...document.querySelectorAll('.ec-other-chapters a')];
      assert.equal(extraLinks.length, 1, 'Download sidebars must not list other documentation chapters');
      assert.equal(extraLinks[0].getAttribute('href'), `https://github.com/gojue/${route.startsWith('/q/') ? 'ecaptureQ' : 'ecapture'}`);
      assert(extraLinks[0].textContent.includes(`${productName} GitHub`), 'Repository link must name the product');
      const image = document.querySelector('.download-intro img');
      const asset = route.startsWith('/q/') ? 'ecaptureq-interface.png' : 'ecapture-terminal.png';
      assert.equal(image?.getAttribute('src'), `/assets/products/${asset}`, 'Download page must show its own product illustration');
    }
    for (const image of document.querySelectorAll('main img')) assert(image.getAttribute('alt')?.trim(), 'Content image is missing alt text');
    for (const element of document.querySelectorAll('a[href], img[src], script[src], link[href], source[src]')) {
      const raw = element.getAttribute('href') || element.getAttribute('src');
      if (!raw || /^(?:data:|mailto:|tel:|javascript:)/.test(raw)) continue;
      assert(!raw.includes('**'), `Markdown emphasis leaked into destination ${raw}`);
      const url = new URL(raw, `https://product-check.invalid${route}`);
      if (url.origin !== 'https://product-check.invalid') continue;
      assert(!/^\/(?:(?:en|zh)\/(?:q|decryptor)|ecaptureq)(?:\/|$)/.test(url.pathname), `Invalid product path ${raw}`);
      const target = outputFile(url.pathname);
      assert(target, `Missing local destination ${raw}`);
      if (url.hash && target.endsWith('.html')) {
        const id = decodeURIComponent(url.hash.slice(1));
        // These release groups are created only after the browser fetches assets.
        const dynamicReleaseGroup = /^\/q\/(en|zh)\/download\/$/.test(url.pathname)
          && ['desktop-packages', 'web-packages'].includes(id);
        assert(dynamicReleaseGroup || documentAt(url.pathname).getElementById(id), `Missing anchor ${raw}`);
      }
    }
  });
  // VitePress emits one lazy-loaded MiniSearch index per locale. Each product
  // article must appear in the index with its sibling pages in that locale.
  const chunkDir = 'dist/assets/chunks';
  const searchIndices = fs.readdirSync(path.join(root, chunkDir)).filter(name => name.endsWith('.js'))
    .map(name => read(`${chunkDir}/${name}`)).filter(chunk => chunk.includes('"documentIds":{'));
  for (const product of products) {
    for (const locale of locales) check(`local search ${product.prefix}/${locale}`, () => {
      const paths = product.slugs.map(slug => articlePath(product, locale, slug));
      const index = searchIndices.find(chunk => chunk.includes(`"${paths[0]}#`));
      assert(index, 'Missing product locale search index');
      for (const page of paths) assert(index.includes(`"${page}#`), `Missing search results for ${page}`);
    });
    for (const slug of product.slugs) check(`built heading parity ${product.prefix}/${slug || 'overview'}`, () => {
      const ids = locales.map(locale => [...documentAt(articlePath(product, locale, slug)).querySelectorAll('main h2[id], main h3[id], main h4[id]')].map(element => element.id));
      assert.deepEqual(ids[0], ids[1], 'Rendered article heading IDs differ');
    });
    check(`unprefixed entry ${product.prefix}`, () => assert.equal(outputFile(`/${product.prefix}`), outputFile(`/${product.prefix}/`)));
  }
}

if (errors.length) {
  console.error(`Product documentation checks failed (${errors.length}):\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Product documentation checks passed: ${products.reduce((total, product) => total + product.slugs.length, 0)} paired pages, stable navigation, images${sourceOnly ? '' : `, ${routes.length} production routes, search indices and local destinations`}.`);
}
