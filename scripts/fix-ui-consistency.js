import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
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
  let originalContent = content;

  // Cleanup duplicates
  content = content.replace(/transition-colors transition-colors/g, 'transition-colors');

  // Hardcoded old footer replacement
  const oldFooterRegex = /<footer class="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">([\s\S]*?)<\/footer>/
  if (oldFooterRegex.test(content)) {
    content = content.replace(oldFooterRegex, `<footer class="bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 py-12 border-t border-gray-100 dark:border-slate-800 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm font-medium">
            &copy; 2026 Tooleva. Free Tools for Everyday Work.
        </div>
    </footer>`);
  }

  // Adding dark mode text to older hub pages headers & paragraphs
  content = content.replace(/class="text-4xl font-extrabold text-gray-900/g, 'class="text-4xl font-extrabold text-gray-900 dark:text-white');
  content = content.replace(/class="text-2xl font-bold text-gray-900"/g, 'class="text-2xl font-bold text-gray-900 dark:text-white"');
  content = content.replace(/class="text-xl text-gray-600/g, 'class="text-xl text-gray-600 dark:text-gray-400');
  content = content.replace(/class="font-bold text-lg text-gray-900 mb-2"/g, 'class="font-bold text-lg text-gray-900 dark:text-white mb-2"');
  content = content.replace(/class="text-gray-600 text-sm"/g, 'class="text-gray-600 dark:text-gray-400 text-sm"');
  content = content.replace(/class="text-3xl font-bold text-gray-900 dark:text-white mb-1"/g, 'class="text-3xl font-bold text-gray-900 dark:text-white mb-1"');
  content = content.replace(/class="text-2xl font-bold mb-4 text-gray-900"/g, 'class="text-2xl font-bold mb-4 text-gray-900 dark:text-white"');
  content = content.replace(/class="prose max-w-none text-gray-600"/g, 'class="prose max-w-none text-gray-600 dark:text-gray-400"');
  content = content.replace(/class="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"/g, 'class="mt-16 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"');
  
  // Fix older cards missing dark mode backgrounds
  content = content.replace(/class="card p-6 block hover:-translate-y-1 transform transition-all"/g, 'class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700"');
  content = content.replace(/class="card p-6 block hover:-translate-y-1 transform transition-all border-t-4/g, 'class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nFixed UI class consistency in ${updatedCount} files.`);
