import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'public') {
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

const htmlFiles = walkSync(path.join(__dirname, '../'));
let updatedCount = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Regex to match <button> that doesn't have a type attribute
    // Negative lookahead to ensure "type=" is not inside the <button ...> tag
    const btnRegex = /<button(?![^>]*\btype=)([^>]*)>/gi;
    
    if (btnRegex.test(content)) {
        content = content.replace(btnRegex, '<button type="button"$1>');
        fs.writeFileSync(file, content, 'utf-8');
        updatedCount++;
    }
});

console.log(`Updated ${updatedCount} HTML files by adding type="button" to implicit submit buttons.`);
