import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://tooleva.com';

function getFiles(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (filePath.includes('node_modules') || filePath.includes('dist') || filePath.includes('.git')) {
            continue;
        }
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, filesList);
        } else if (filePath.endsWith('.html')) {
            filesList.push(filePath);
        }
    }
    return filesList;
}

const allHtmlFiles = getFiles(ROOT_DIR);

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

allHtmlFiles.forEach(file => {
    // Relative path from ROOT
    const relPath = path.relative(ROOT_DIR, file);
    
    let urlPath = relPath.split(path.sep).join('/');
    
    if (urlPath.endsWith('index.html')) {
        urlPath = urlPath.slice(0, -10);
    }

    const fullUrl = `${BASE_URL}/${urlPath}`;
    const priority = urlPath === '' ? '1.0' : (urlPath.startsWith('tools/') ? '0.8' : '0.6');
    
    const stat = fs.statSync(file);
    const lastMod = stat.mtime.toISOString().split('T')[0];

    xml += `  <url>\n`;
    xml += `    <loc>${fullUrl}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
});

xml += `</urlset>`;

// Ensure public dir exists
const publicDir = path.join(ROOT_DIR, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
console.log(`✅ successfully generated sitemap.xml with ${allHtmlFiles.length} URLs.`);
