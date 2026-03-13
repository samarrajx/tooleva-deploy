/**
 * Auto-generates public/sitemap.xml by scanning all tool/blog/page HTML files.
 * Run: node scripts/generate-sitemap.js
 */

import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://tooleva.com';
const TODAY = new Date().toISOString().split('T')[0];

// Files/pages to EXCLUDE from sitemap
const EXCLUDE_FILES = new Set([
  'ui-components.html', // dev-only file
]);

const urls = [];

function addUrl(loc, priority, changefreq = 'weekly') {
  urls.push({ loc, priority, changefreq, lastmod: TODAY });
}

// 1. Homepage
addUrl(`${BASE_URL}/`, 1.0);

// 2. Tools index
addUrl(`${BASE_URL}/tools/`, 0.9);

// 3. Blog index
addUrl(`${BASE_URL}/blog/`, 0.7);

// 4. Static pages
['about', 'contact', 'privacy', 'terms'].forEach(page =>
  addUrl(`${BASE_URL}/${page}/`, 0.5)
);

// 5. All tool sub-directories that have index.html
const toolsDir = join(ROOT, 'tools');
readdirSync(toolsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort()
  .forEach(name => {
    const indexPath = join(toolsDir, name, 'index.html');
    if (existsSync(indexPath)) {
      addUrl(`${BASE_URL}/tools/${name}/`, 0.8);
    }
  });

// 6. Individual blog posts (clean slug URLs)
const blogDir = join(ROOT, 'blog');
readdirSync(blogDir)
  .filter(f => f.endsWith('.html') && f !== 'index.html' && !EXCLUDE_FILES.has(f))
  .sort()
  .forEach(f => {
    const slug = f.replace('.html', '');
    addUrl(`${BASE_URL}/blog/${slug}/`, 0.6);
  });

// 7. Generate XML
const xmlEntries = urls
  .map(({ loc, lastmod, changefreq, priority }) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

const publicDir = join(ROOT, 'public');
if (!existsSync(publicDir)) mkdirSync(publicDir);

const outputPath = join(publicDir, 'sitemap.xml');
writeFileSync(outputPath, xml, 'utf-8');
console.log(`✅ Sitemap generated: ${urls.length} URLs → public/sitemap.xml`);
