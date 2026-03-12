import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                filelist = walkSync(dirFile, filelist);
            }
        } else {
            if (file.endsWith('.html')) {
                filelist.push(dirFile);
            }
        }
    });
    return filelist;
};

const htmlFiles = walkSync(path.join(__dirname, '../tools/'));
const searchIndex = [];

htmlFiles.forEach(file => {
    // skip category hubs
    const normalizedFile = file.replace(/\\/g, '/');
    const toolSubPath = normalizedFile.split('/tools/')[1];
    
    if (toolSubPath === 'index.html' || 
        toolSubPath.split('/').length < 2 || 
        ['pdf-tools', 'image-tools', 'video-tools', 'audio-tools', 'calculators', 'text-tools', 'developer-tools', 'security-tools', 'converter-tools', 'utility-tools'].includes(toolSubPath.replace('/index.html', ''))) {
        return; // skip hub pages
    }

    const content = fs.readFileSync(file, 'utf-8');
    
    // extract title
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    let title = titleMatch ? titleMatch[1].replace(' | Tooleva', '').trim() : 'Unknown Tool';
    
    // extract description
    const descMatch = content.match(/<meta name="description" content="(.*?)">/) || content.match(/<meta name="description" content="(.*?)"\s*\/>/);
    let description = descMatch ? descMatch[1].trim() : '';

    const url = `/tools/${toolSubPath}`;

    searchIndex.push({
        title,
        description,
        url
    });
});

fs.writeFileSync(path.join(__dirname, '../public/search-index.json'), JSON.stringify(searchIndex, null, 2), 'utf-8');
console.log(`Generated search index with ${searchIndex.length} tools.`);
