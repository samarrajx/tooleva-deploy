import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replacement = `<div class="space-y-16">
                <!-- PDF Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">PDF Tools</h2>
                        <a href="/tools/pdf-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/compress-pdf/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-red-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Compress PDF</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Reduce PDF file size while maintaining quality.</p>
                        </a>
                        <a href="/tools/merge-pdf/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-red-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Merge PDF</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Combine multiple PDFs into a single file.</p>
                        </a>
                        <a href="/tools/split-pdf/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-red-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Split PDF</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Extract pages or split a PDF into multiple parts.</p>
                        </a>
                        <a href="/tools/pdf-to-jpg/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-red-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">PDF to JPG</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Convert PDF pages into high-quality JPG images.</p>
                        </a>
                    </div>
                </section>

                <!-- Image Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Image Tools</h2>
                        <a href="/tools/image-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/image-compressor/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-blue-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Image Compressor</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Shrink image files seamlessly via browser.</p>
                        </a>
                        <a href="/tools/resize-image/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-blue-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Resize Image</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Change dimensions of your target image quickly.</p>
                        </a>
                        <a href="/tools/jpg-to-png/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-blue-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">JPG to PNG</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Effortless image format conversion.</p>
                        </a>
                        <a href="/tools/crop-image/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-blue-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Crop Image</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Trim and reframe your images locally.</p>
                        </a>
                    </div>
                </section>

                <!-- Video Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Video Tools</h2>
                        <a href="/tools/video-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/video-compressor/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-purple-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Video Compressor</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Shrink video files directly in your browser.</p>
                        </a>
                        <a href="/tools/trim-video/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-purple-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Trim Video</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Cut unwanted sections from your videos.</p>
                        </a>
                        <a href="/tools/merge-videos/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-purple-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Merge Videos</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Join multiple video files without uploading.</p>
                        </a>
                        <a href="/tools/convert-video-format/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-purple-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Format Converter</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Change video formats with local FFmpeg.</p>
                        </a>
                    </div>
                </section>

                <!-- Audio Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Audio Tools</h2>
                        <a href="/tools/audio-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/trim-audio/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-pink-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Trim Audio</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Cut snippets from music and recordings.</p>
                        </a>
                        <a href="/tools/merge-audio/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-pink-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Merge Audio</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Combine MP3s and audio files together.</p>
                        </a>
                        <a href="/tools/extract-audio/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate- eighty border-gray-100 dark:border-slate-700 border-t-4 border-t-pink-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Extract Audio</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Pull sound tracks directly from video files.</p>
                        </a>
                        <a href="/tools/noise-reduction/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-pink-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Noise Reduction</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Clean up background noise from tracks.</p>
                        </a>
                    </div>
                </section>

                <!-- Calculators Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Calculators</h2>
                        <a href="/tools/calculators/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/age-calculator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-green-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Age Calculator</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Calculate exact age from date of birth.</p>
                        </a>
                        <a href="/tools/percentage-calculator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-green-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Percentage</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Quick percentage calculations and differences.</p>
                        </a>
                        <a href="/tools/loan-emi-calculator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-green-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">EMI Calculator</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Compute estimated monthly payments online.</p>
                        </a>
                        <a href="/tools/profit-margin-calculator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-green-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Profit Margin</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Determine business margins and markups.</p>
                        </a>
                    </div>
                </section>

                <!-- Text Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Text Tools</h2>
                        <a href="/tools/text-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/word-counter/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-yellow-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Word Counter</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Count words, characters, and sentences.</p>
                        </a>
                        <a href="/tools/remove-extra-spaces/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-yellow-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Remove Spaces</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Clean up messy strings and excess whitespace.</p>
                        </a>
                        <a href="/tools/remove-duplicate-lines/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-yellow-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Duplicate Lines</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Filter out repeating rows instantly.</p>
                        </a>
                        <a href="/tools/lorem-ipsum-generator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-yellow-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Lorem Ipsum</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Generate placeholder text formats.</p>
                        </a>
                    </div>
                </section>

                <!-- Developer Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Developer Tools</h2>
                        <a href="/tools/developer-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/json-formatter/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-indigo-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">JSON Formatter</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Beautify and stringify JSON objects.</p>
                        </a>
                        <a href="/tools/base64-encoder/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-indigo-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Base64 Encoder</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Convert text into Base64 securely.</p>
                        </a>
                        <a href="/tools/url-encoder/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-indigo-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">URL Encoder</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Escape components for URI protocols.</p>
                        </a>
                        <a href="/tools/jwt-decoder/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-indigo-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">JWT Decoder</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Inspect web tokens in real-time.</p>
                        </a>
                    </div>
                </section>

                <!-- Converter Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Converter Tools</h2>
                        <a href="/tools/converter-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/length-converter/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-orange-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Length Converter</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Miles, km, feet, meters conversions.</p>
                        </a>
                        <a href="/tools/currency-converter/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-orange-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Currency Converter</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Live forex data and exchange rates.</p>
                        </a>
                        <a href="/tools/data-storage-converter/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-orange-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Data Storage</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">MB, GB, TB exact byte calculations.</p>
                        </a>
                        <a href="/tools/time-zone-converter/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-orange-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Time Zones</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Global standard time mappings.</p>
                        </a>
                    </div>
                </section>

                <!-- Security Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Security Tools</h2>
                        <a href="/tools/security-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/password-generator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-slate-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Password Generator</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Create extremely strong randomized strings.</p>
                        </a>
                        <a href="/tools/encrypt-decrypt/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-slate-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Encrypt Text</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">AES client-side text encryption.</p>
                        </a>
                        <a href="/tools/hash-generator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-slate-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Hash Generator</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Compute MD5, SHA-256 strings safely.</p>
                        </a>
                        <a href="/tools/htpasswd-generator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-slate-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">htpasswd Gen</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Apache password file format hashes.</p>
                        </a>
                    </div>
                </section>

                <!-- Utility Section -->
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Utility Tools</h2>
                        <a href="/tools/utility-tools/index.html" class="text-primary-600 hover:text-primary-700 font-medium">View Category &rarr;</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <a href="/tools/qr-code-generator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-teal-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">QR Code Gen</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Design and download custom QR codes.</p>
                        </a>
                        <a href="/tools/uuid-generator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-teal-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">UUID Generator</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Generate v4 universally unique ids.</p>
                        </a>
                        <a href="/tools/regex-tester/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-teal-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Regex Tester</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Validate regular expressions in-browser.</p>
                        </a>
                        <a href="/tools/random-string-generator/index.html" class="card p-6 block hover:-translate-y-1 transform transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 border-t-4 border-t-teal-500">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Random Strings</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">Create randomized patterns quickly.</p>
                        </a>
                    </div>
                </section>
            </div>`;

const indexPath = path.join(__dirname, '../tools/index.html');
let content = fs.readFileSync(indexPath, 'utf-8');

// Replace the block exactly
const spaceYRegex = /<div class="space-y-16">[\s\S]*?<\/div>[\s]*<\/div>[\s]*<\/main>/;

// Just swapping the space-y-16 wrapper directly
content = content.replace(/<div class="space-y-16">[\s\S]*?<\/div>\s*<\/div>\s*<\/main>/, replacement + '\n        </div>\n    </main>');

fs.writeFileSync(indexPath, content, 'utf-8');
console.log('Successfully updated tools/index.html with all 10 categories mapping.');
