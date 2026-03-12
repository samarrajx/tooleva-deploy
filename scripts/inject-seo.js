import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');

function getFiles(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (filePath.includes('node_modules') || filePath.includes('dist') || filePath.includes('.git') || filePath.includes('public')) {
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

let injectedCount = 0;

allHtmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Extract title and description
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const descMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/);

    const title = titleMatch ? titleMatch[1] : 'Tooleva Tool';
    const description = descMatch ? descMatch[1] : 'A free online tool by Tooleva.';
    
    const urlPath = path.relative(ROOT_DIR, file).split(path.sep).join('/').replace('index.html', '');
    const url = `https://tooleva.com/${urlPath}`;

    // Schema payload
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": title,
        "description": description,
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": url,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    const schemaStr = `\n    <script type="application/ld+json">\n    ${JSON.stringify(schema, null, 4)}\n    </script>\n</head>`;
    
    // If schema already injected, skip or replace. Let's replace if exists to keep it fresh.
    if(content.includes('application/ld+json')) {
        content = content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
    }

    // Inject before </head>
    if (content.includes('</head>')) {
        content = content.replace('</head>', schemaStr);
        fs.writeFileSync(file, content);
        injectedCount++;
    }
});

console.log(`✅ successfully injected JSON-LD schema into ${injectedCount} HTML files.`);
