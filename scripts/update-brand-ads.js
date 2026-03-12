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

const LOGO_HTML = `<img src="/logo.png" alt="Tooleva Logo" class="h-8 w-auto rounded-md shadow-sm">`;

// Ad space to be injected in tool pages
const AD_SPACE_TOP = `
        <!-- Ad Space: Top Banner -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4 w-full">
            <div class="w-full bg-gray-100 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 font-medium py-4 min-h-[90px]">
                <span class="text-xs uppercase tracking-wider mb-1 opacity-50">Advertisement</span>
                <span>Space (Leaderboard 728x90)</span>
            </div>
        </div>`;
        
const AD_SPACE_SIDE = `
            <!-- Ad Space: Sidebar/Medium Rectangle -->
            <div class="w-full bg-gray-100 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 font-medium py-4 min-h-[250px] mt-8">
                <span class="text-xs uppercase tracking-wider mb-1 opacity-50">Advertisement</span>
                <span>Space (Medium 300x250)</span>
            </div>`;

let updatedCount = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // 1. Inject Favicon
  if (!content.includes('<link rel="icon"')) {
    content = content.replace(/<\/head>/i, `    <link rel="icon" type="image/png" href="/logo.png">\n</head>`);
  }

  // 2. Replace Header SVG Logo
  // Match the <a> tag for the logo in the header
  const headerLogoRegex = /<a href="\/".*?>\s*<svg.*?<\/svg>\s*Tooleva\s*<\/a>/g;
  if (headerLogoRegex.test(content)) {
    content = content.replace(headerLogoRegex, `<a href="/" class="text-2xl font-extrabold tracking-tight text-primary-600 flex items-center gap-3">\n                ${LOGO_HTML}\n                Tooleva\n            </a>`);
  } else {
    // some cases like <a href="/" class="text-2xl font-bold tracking-tight text-primary-600 flex items-center gap-2">Tooleva</a> might exist
    const altHeaderLogoRegex = /<a href="\/".*?flex items-center gap-2">Tooleva<\/a>/g;
    if (altHeaderLogoRegex.test(content)) {
         content = content.replace(altHeaderLogoRegex, `<a href="/" class="text-2xl font-extrabold tracking-tight text-primary-600 flex items-center gap-3">\n                ${LOGO_HTML}\n                Tooleva\n            </a>`);
    }
  }

  // 3. Replace Footer SVG Logo
  const footerLogoRegex = /<a href="\/".*?mb-4">\s*<svg.*?<\/svg>\s*Tooleva\s*<\/a>/g;
  if (footerLogoRegex.test(content)) {
    content = content.replace(footerLogoRegex, `<a href="/" class="text-2xl font-extrabold tracking-tight text-primary-600 flex items-center gap-3 mb-4">\n                    ${LOGO_HTML}\n                    Tooleva\n                </a>`);
  } else {
     // match <a href="/" class="text-2xl font-extrabold tracking-tight text-primary-600 flex items-center gap-2 mb-4">
     const altFooterLogoRegex = /<a href="\/".*?flex items-center gap-2 mb-4">\s*Tooleva\s*<\/a>/g;
     if (altFooterLogoRegex.test(content)) {
         content = content.replace(altFooterLogoRegex, `<a href="/" class="text-2xl font-extrabold tracking-tight text-primary-600 flex items-center gap-3 mb-4">\n                    ${LOGO_HTML}\n                    Tooleva\n                </a>`);
     }
  }

  // 4. Inject Ad Space ONLY on individual tool pages
  const normalizedFile = file.replace(/\\/g, '/');
  if (normalizedFile.includes('/tools/') && !normalizedFile.includes('/tools/index.html') && normalizedFile.split('/tools/')[1].includes('/')) {
      const toolSubPath = normalizedFile.split('/tools/')[1];
      if (toolSubPath === 'pdf-tools/index.html' || toolSubPath === 'image-tools/index.html' || toolSubPath === 'audio-tools/index.html' || toolSubPath === 'video-tools/index.html' || toolSubPath === 'text-tools/index.html' || toolSubPath === 'developer-tools/index.html' || toolSubPath === 'converter-tools/index.html' || toolSubPath === 'security-tools/index.html' || toolSubPath === 'utility-tools/index.html' || toolSubPath === 'calculators/index.html') {
          // This is a category hub, skip it
      } else {
          // This is an actual tool instance
          if (!content.includes('Advertisement Space') && !content.includes('Leaderboard 728x90')) {
              // Inject Top Leaderboard Ad
              content = content.replace(/(<main[^>]*>)/i, `$1${AD_SPACE_TOP}`);
              
              // Also add a medium rectangle ad space near the bottom of main processing card if possible.
              // We can inject it before closing </main>
              content = content.replace(/(<\/main>)/i, `${AD_SPACE_SIDE}\n        $1`);
          }
      }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log(`Updated Logo/Ads in: ${file}`);
  }
});

console.log(`Successfully updated logos, favicons, and ad spaces in ${updatedCount} files.`);
