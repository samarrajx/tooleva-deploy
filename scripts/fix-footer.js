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

const htmlFiles = walkSync(path.join(__dirname, '../'));

const NEW_FOOTER = `    <footer class="bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 py-12 border-t border-gray-100 dark:border-slate-800 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div class="md:col-span-1">
                <a href="/" class="text-2xl font-extrabold tracking-tight text-primary-600 flex items-center gap-2 mb-4">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Tooleva
                </a>
                <p class="text-sm">Free, secure, and client-side tools for everyday digital tasks. No installation required.</p>
            </div>
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/tools/pdf-tools/index.html" class="hover:text-primary-600 transition-colors">PDF Tools</a></li>
                    <li><a href="/tools/image-tools/index.html" class="hover:text-primary-600 transition-colors">Image Tools</a></li>
                    <li><a href="/tools/video-tools/index.html" class="hover:text-primary-600 transition-colors">Video Tools</a></li>
                    <li><a href="/tools/audio-tools/index.html" class="hover:text-primary-600 transition-colors">Audio Tools</a></li>
                </ul>
            </div>
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-4">More Categories</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/tools/text-tools/index.html" class="hover:text-primary-600 transition-colors">Text Tools</a></li>
                    <li><a href="/tools/developer-tools/index.html" class="hover:text-primary-600 transition-colors">Developer Tools</a></li>
                    <li><a href="/tools/security-tools/index.html" class="hover:text-primary-600 transition-colors">Security Tools</a></li>
                    <li><a href="/tools/utility-tools/index.html" class="hover:text-primary-600 transition-colors">Utility Tools</a></li>
                </ul>
            </div>
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-4">Company</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/about/index.html" class="hover:text-primary-600 transition-colors">About Us</a></li>
                    <li><a href="/contact/index.html" class="hover:text-primary-600 transition-colors">Contact</a></li>
                    <li><a href="/privacy/index.html" class="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="/terms/index.html" class="hover:text-primary-600 transition-colors">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm font-medium border-t border-gray-100 dark:border-slate-800 pt-8">
            &copy; 2026 Tooleva. Free Tools for Everyday Work.
        </div>
    </footer>`;

let updatedCount = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  if (content.includes('<footer')) {
     content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, NEW_FOOTER);
  } else {
     content = content.replace(/<\/body>/i, NEW_FOOTER + '\n</body>');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log(`Updated footer in: ${file}`);
  }
});

console.log(`\nFixed footers in ${updatedCount} files.`);
