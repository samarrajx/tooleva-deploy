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

// Start from the root
const htmlFiles = walkSync(path.join(__dirname, '../'));

const BAD_BODY_REGEX = /<body class="bg-gray-50 text-gray-900 font-sans min-[a-zA-Z\-]+ flex flex-col">/g;
const GOOD_BODY = '<body class="bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans min-h-screen flex flex-col transition-colors duration-300">';

const HOME_BODY_REGEX = /<body class="bg-bg-light text-text-light font-sans min-h-screen flex flex-col antialiased">/g;
const HOME_GOOD_BODY = '<body class="bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans min-h-screen flex flex-col antialiased transition-colors duration-300">';

let updatedCount = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  if (BAD_BODY_REGEX.test(content)) {
    content = content.replace(BAD_BODY_REGEX, GOOD_BODY);
    changed = true;
  }
  
  if (HOME_BODY_REGEX.test(content)) {
    content = content.replace(HOME_BODY_REGEX, HOME_GOOD_BODY);
    changed = true;
  }
  
  // check theme script injection
  const themeScriptRegex = /import\s+\{\s*initThemeToggle\s*\}\s+from\s+['"](.+)theme\.js['"]/;
  if (!themeScriptRegex.test(content) && content.includes('</head>')) {
     const relativePath = path.relative(path.dirname(file), path.join(__dirname, '../src/js/theme.js')).replace(/\\/g, '/');
     const importPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;
     
     const scriptHtml = `    <script type="module">
        import { initThemeToggle } from '${importPath}';
        document.addEventListener('DOMContentLoaded', () => initThemeToggle('theme-toggle'));
    </script>
</head>`;
     
     content = content.replace(/<\/head>/i, scriptHtml);
     changed = true;
  }
  
  // check button
  if (!content.includes('id="theme-toggle"') && content.includes('</nav>')) {
     const btnHtml = `<button id="theme-toggle" class="p-2 ml-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors focus:outline-none"></button>`;
     content = content.replace('</nav>', `    ${btnHtml}\n            </nav>`);
     changed = true;
  }

  // Quick fix for nav bar text color consistency mapping the old tailwind colors to new
  if (content.includes('text-gray-600 hover:text-primary-600')) {
     content = content.replace(/text-gray-600 hover:text-primary-600/g, 'hover:text-primary-600 transition-colors');
     changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nFixed theme consistency in ${updatedCount} files.`);
