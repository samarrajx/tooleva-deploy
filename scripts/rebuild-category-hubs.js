import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure search-index.json exists
const searchIndexPath = path.join(__dirname, '../public/search-index.json');
if (!fs.existsSync(searchIndexPath)) {
    console.error("Please run generate-search-index.js first.");
    process.exit(1);
}

const rawIndex = fs.readFileSync(searchIndexPath, 'utf-8');
const searchIndex = JSON.parse(rawIndex);

// Mapping of Categories to Tool Subpaths
const categories = {
    'pdf-tools': { name: 'PDF Tools', color: 'red', icon: '<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>' },
    'image-tools': { name: 'Image Tools', color: 'blue', icon: '<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>' },
    'video-tools': { name: 'Video Tools', color: 'purple', icon: '<path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>' },
    'audio-tools': { name: 'Audio Tools', color: 'pink', icon: '<path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"></path>' },
    'calculators': { name: 'Calculators', color: 'green', icon: '<path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm8 14H7v-2h6v2zm-3-4H7v-2h3v2zm3-4H7V6h6v2zm-3 4h3v-2h-3v2z" clip-rule="evenodd"></path>' },
    'text-tools': { name: 'Text Tools', color: 'yellow', icon: '<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path>' },
    'developer-tools': { name: 'Developer Tools', color: 'indigo', icon: '<path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>' },
    'converter-tools': { name: 'Converter Tools', color: 'orange', icon: '<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>' },
    'security-tools': { name: 'Security Tools', color: 'slate', icon: '<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>' },
    'utility-tools': { name: 'Utility Tools', color: 'teal', icon: '<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>' }
};

const categorizationLogic = {
    'pdf-tools': ['pdf'],
    'image-tools': ['image', 'jpg', 'png', 'webp', 'crop', 'watermark', 'blur'],
    'video-tools': ['video', 'mp4', 'resolution'],
    'audio-tools': ['audio', 'mp3', 'wav', 'noise'],
    'calculators': ['calculator', 'age', 'percentage', 'emi', 'discount', 'tip', 'margin', 'date', 'bmi'],
    'text-tools': ['text', 'word', 'character', 'case', 'sort', 'lorem', 'slug', 'handwriting', 'line', 'space'],
    'developer-tools': ['json', 'base64', 'url encoder', 'url decoder', 'html minifier', 'html formatter', 'css minifier', 'js minifier', 'jwt', 'color converter'],
    'converter-tools': ['converter', 'length', 'weight', 'temperature', 'currency', 'speed', 'area', 'storage', 'time-zone', 'binary', 'number base'],
    'security-tools': ['password', 'hash', 'encrypt', 'decrypt', 'secure', 'htpasswd', 'bcrypt'],
    'utility-tools': ['qr code', 'barcode', 'uuid generator', 'uuid checker', 'regex', 'random number', 'random string', 'random name', 'random color']
};

for (const [catId, catInfo] of Object.entries(categories)) {
    const hubDir = path.join(__dirname, '../tools/', catId);
    const hubIndexMatch = path.join(hubDir, 'index.html');
    
    if (!fs.existsSync(hubIndexMatch)) continue;

    let content = fs.readFileSync(hubIndexMatch, 'utf-8');
    
    // Find all tools that match this category
    const matchingTools = searchIndex.filter(tool => {
        const titleStr = tool.title.toLowerCase();
        const keywords = categorizationLogic[catId] || [];
        return keywords.some(kw => titleStr.includes(kw) || tool.url.includes(kw));
    }).filter((tool, index, self) => index === self.findIndex((t) => t.url === tool.url)); // dedupe

    if (matchingTools.length === 0) continue;

    // Build the grid HTML
    let gridHtml = `                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n`;
    
    matchingTools.forEach(tool => {
        gridHtml += `                    <a href="${tool.url}" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                        <div class="w-12 h-12 rounded-xl bg-${catInfo.color}-50 dark:bg-${catInfo.color}-500/10 text-${catInfo.color}-500 flex items-center justify-center mb-4">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">${catInfo.icon}</svg>
                        </div>
                        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">${tool.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">${tool.description.substring(0, 100)}${tool.description.length > 100 ? '...' : ''}</p>
                    </a>\n`;
    });
    gridHtml += `                </div>`;

    // Find where the tools grid starts
    let startMarker = '<div class="grid grid-cols-1 md:grid-cols-2';
    let startIndex = content.indexOf(startMarker);
    
    // Some hubs might have grid-cols-3 instead of grid-cols-2 lg:grid-cols-4
    if (startIndex === -1) {
        startMarker = '<div class="grid grid-cols-1 md:grid-cols-3';
        startIndex = content.indexOf(startMarker);
    }
    
    // Or just look for grid grid-cols-1
    if (startIndex === -1) {
        startMarker = '<div class="grid grid-cols-1';
        startIndex = content.indexOf(startMarker);
    }
    
    if (startIndex !== -1) {
        // Find the end of this grid (closing div) by finding the end of the line
        // We look for the <div class="mt-16 bg-white or </main> whichever comes first
        let endIndex = content.indexOf('<div class="mt-16', startIndex);
        if (endIndex === -1) endIndex = content.indexOf('</div>\n        </div>\n    </main>', startIndex); // Try to find the end of the container
        if (endIndex === -1) endIndex = content.indexOf('</main>', startIndex);
        
        if (endIndex !== -1) {
            const before = content.substring(0, startIndex);
            const after = content.substring(endIndex);
            
            content = before + gridHtml + '\n            \n            ' + after;
            fs.writeFileSync(hubIndexMatch, content, 'utf-8');
            console.log(`Updated Hub: ${catId} with ${matchingTools.length} tools`);
        } else {
            console.warn(`Could not find end of grid for ${catId}`);
        }
    } else {
        console.warn(`Could not find grid start for ${catId}`);
    }
}
