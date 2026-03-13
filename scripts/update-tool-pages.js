/**
 * Batch-updates all tool HTML pages with the new premium dark design header/footer.
 * Run: node scripts/update-tool-pages.js
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

// Directories to update (tools + blog + about/contact/privacy/terms)
const SCAN_DIRS = ['tools', 'blog', 'about', 'contact', 'privacy', 'terms'];

// Files to skip
const SKIP_FILES = new Set(['ui-components.html']);

// ─── New <head> additions ────────────────────────────────────────────────────
const HEAD_ADDITIONS = `
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script>
  // Restore saved theme BEFORE render to avoid flash
  (function(){
    const t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  })();
</script>
<script id="tw-dark-config">
  if(window.tailwind) {
    tailwind.config = {
      darkMode: "class",
      theme: { extend: { colors: { primary: "#7f13ec" }, fontFamily: { display: ["Space Grotesk","sans-serif"] } } }
    };
  }
</script>
<style>
  html { font-family: 'Space Grotesk', sans-serif !important; transition: background 0.3s, color 0.3s; }
  /* ── Dark mode ── */
  html.dark body  { background: #0f0814 !important; color: #e2e8f0 !important; }
  html.dark .glass-nav-new {
    background: rgba(25,16,34,0.75) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border-bottom: 1px solid rgba(255,255,255,0.07) !important;
    box-shadow: 0 2px 24px rgba(0,0,0,0.5) !important;
  }
  html.dark .tlv-footer { background: rgba(15,8,20,0.95) !important; border-top: 1px solid rgba(255,255,255,0.08) !important; }
  /* ── Light mode ── */
  html:not(.dark) body { background: #f7f6f8 !important; color: #1a1a2e !important; }
  html:not(.dark) .glass-nav-new {
    background: rgba(255,255,255,0.85) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border-bottom: 1px solid rgba(0,0,0,0.08) !important;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06) !important;
  }
  html:not(.dark) .glass-nav-new a, html:not(.dark) .glass-nav-new span { color: #374151 !important; }
  html:not(.dark) .glass-nav-new a:hover { color: #7f13ec !important; }
  html:not(.dark) .glass-nav-new .nav-brand-text { color: #1a1a2e !important; }
  html:not(.dark) main h1, html:not(.dark) main h2, html:not(.dark) main h3, html:not(.dark) main p, html:not(.dark) main label, html:not(.dark) main span:not(.material-symbols-outlined) { color: #1a1a2e !important; }
  html:not(.dark) .tlv-footer { background: #f0eef4 !important; border-top: 1px solid rgba(0,0,0,0.08) !important; }
  html:not(.dark) .tlv-footer p, html:not(.dark) .tlv-footer a { color: #6b7280 !important; }
  html:not(.dark) .tlv-footer h4 { color: #111827 !important; }
  html:not(.dark) .tlv-footer a:hover { color: #7f13ec !important; }
  /* Toggle button */
  html.dark  #tlv-theme-icon::after  { content: 'light_mode'; }
  html:not(.dark) #tlv-theme-icon::after { content: 'dark_mode'; }
  html:not(.dark) #tlv-theme-toggle:hover { background: rgba(0,0,0,0.05) !important; }
</style>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('tlv-theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
</script>`;

// ─── New Header HTML ─────────────────────────────────────────────────────────
function buildHeader(depthPrefix) {
  return `    <header class="glass-nav-new sticky top-0 z-50 py-3 mb-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <a href="${depthPrefix}/" class="flex items-center gap-3 group">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/20">
                    <span class="material-symbols-outlined text-white text-lg">handyman</span>
                </div>
                <span class="nav-brand-text text-white text-xl font-bold tracking-tight">Tooleva</span>
            </a>
            <nav class="hidden md:flex space-x-6 text-sm font-medium items-center">
                <a href="${depthPrefix}/tools/index.html" class="text-slate-300 hover:text-white transition-colors">Tools</a>
                <a href="${depthPrefix}/blog/index.html" class="text-slate-300 hover:text-white transition-colors">Blog</a>
                <a href="${depthPrefix}/about/index.html" class="text-slate-300 hover:text-white transition-colors">About</a>
                <a href="${depthPrefix}/contact/index.html" class="text-slate-300 hover:text-white transition-colors">Contact</a>
                <button type="button" id="tlv-theme-toggle" aria-label="Toggle Dark Mode"
                    class="flex w-9 h-9 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none ml-2">
                    <span id="tlv-theme-icon" class="material-symbols-outlined text-xl"></span>
                </button>
            </nav>
        </div>
    </header>`;
}

// ─── New Footer HTML ─────────────────────────────────────────────────────────
function buildFooter(depthPrefix) {
  return `    <footer class="tlv-footer relative mt-auto pt-14 pb-8">
        <div class="absolute top-0 inset-x-0 h-[1px]" style="background:linear-gradient(90deg,transparent,rgba(127,19,236,0.5),transparent)"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div>
                    <a href="${depthPrefix}/" class="flex items-center gap-2 mb-3">
                        <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                            <span class="material-symbols-outlined text-white text-base">handyman</span>
                        </div>
                        <span class="text-white text-lg font-bold">Tooleva</span>
                    </a>
                    <p class="text-slate-400 text-sm leading-relaxed">Free, secure, client-side tools for everyday digital tasks. No installation required.</p>
                </div>
                <div>
                    <h4 class="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Categories</h4>
                    <ul class="space-y-2">
                        <li><a href="${depthPrefix}/tools/pdf-tools/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">PDF Tools</a></li>
                        <li><a href="${depthPrefix}/tools/image-tools/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Image Tools</a></li>
                        <li><a href="${depthPrefix}/tools/video-tools/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Video Tools</a></li>
                        <li><a href="${depthPrefix}/tools/audio-tools/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Audio Tools</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-semibold mb-3 text-sm uppercase tracking-wider">More Tools</h4>
                    <ul class="space-y-2">
                        <li><a href="${depthPrefix}/tools/developer-tools/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Developer Tools</a></li>
                        <li><a href="${depthPrefix}/tools/security-tools/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Security Tools</a></li>
                        <li><a href="${depthPrefix}/tools/calculators/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Calculators</a></li>
                        <li><a href="${depthPrefix}/tools/text-tools/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Text Tools</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Company</h4>
                    <ul class="space-y-2">
                        <li><a href="${depthPrefix}/about/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">About Us</a></li>
                        <li><a href="${depthPrefix}/contact/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Contact</a></li>
                        <li><a href="${depthPrefix}/privacy/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Privacy Policy</a></li>
                        <li><a href="${depthPrefix}/terms/index.html" class="text-slate-400 hover:text-purple-400 transition-colors text-sm">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div class="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
                <p class="text-slate-500 text-sm">© 2026 Tooleva. All rights reserved.</p>
                <div class="flex items-center gap-1 text-sm text-slate-500">
                    Made with <span class="material-symbols-outlined text-red-500 text-base mx-1">favorite</span> for everyone
                </div>
            </div>
        </div>
    </footer>`;
}

// ─── Process a single HTML file ──────────────────────────────────────────────
function processFile(filePath) {
  let html = readFileSync(filePath, 'utf-8');

  // Determine depth for relative prefix
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  const depth = rel.split('/').length - 1;
  const depthPrefix = depth === 1 ? '.' : Array(depth).fill('..').join('/');

  // 1. Add <html class="dark"> if not present
  html = html.replace(/<html(\s(?![^>]*class)[^>]*)?>/, (m, attrs) => {
    if (m.includes('class=')) return m.replace(/class="([^"]*)"/, (_, c) => `class="${c} dark"`);
    return `<html class="dark"${attrs || ''}>`;
  });
  if (!html.includes('class="dark"') && !html.includes("class='dark'")) {
    html = html.replace('<html', '<html class="dark"');
  }

  // 2. Remove old injected additions if present, then re-inject (handles re-runs)
  // Strip everything we injected previously between the CDN tailwind tag and </style>
  const OLD_MARKER = 'cdn.tailwindcss.com';
  const NEW_MARKER = 'tlv-theme-toggle';
  if (html.includes(OLD_MARKER) && !html.includes(NEW_MARKER)) {
    // Old injection present but not new — remove old block before injecting new
    html = html.replace(/\n?<script src="https:\/\/cdn\.tailwindcss\.com[\s\S]*?<\/style>\n?<script>\n\s*document\.addEventListener[\s\S]*?<\/script>/m, '');
  }
  if (!html.includes(NEW_MARKER)) {
    html = html.replace('</head>', `${HEAD_ADDITIONS}\n</head>`);
  }

  // 3. Replace <header ...>...</header>
  const headerRegex = /<header[\s\S]*?<\/header>/;
  const newHeader = buildHeader(depthPrefix);
  if (headerRegex.test(html)) {
    html = html.replace(headerRegex, newHeader);
  }

  // 4. Replace <footer ...>...</footer>
  const footerRegex = /<footer[\s\S]*?<\/footer>/;
  const newFooter = buildFooter(depthPrefix);
  if (footerRegex.test(html)) {
    html = html.replace(footerRegex, newFooter);
  }

  writeFileSync(filePath, html, 'utf-8');
}

// ─── Scan & process ──────────────────────────────────────────────────────────
let updated = 0;
let skipped = 0;

function scanDir(dir) {
  const items = readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      scanDir(fullPath);
    } else if (item.name.endsWith('.html') && !SKIP_FILES.has(item.name)) {
      try {
        processFile(fullPath);
        updated++;
        process.stdout.write(`  ✓ ${relative(ROOT, fullPath)}\n`);
      } catch (err) {
        console.error(`  ✗ ${relative(ROOT, fullPath)}: ${err.message}`);
        skipped++;
      }
    }
  }
}

console.log('🎨 Applying premium dark design to all tool pages...\n');
for (const dir of SCAN_DIRS) {
  const fullDir = join(ROOT, dir);
  try { scanDir(fullDir); } catch {}
}

console.log(`\n✅ Done! Updated: ${updated} files, Skipped: ${skipped} files`);
