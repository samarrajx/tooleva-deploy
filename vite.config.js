import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        toolsIndex: resolve(__dirname, 'tools/index.html'),
        // PDF Tools
        pdfIndex: resolve(__dirname, 'tools/pdf-tools/index.html'),
        compressPdf: resolve(__dirname, 'tools/compress-pdf/index.html'),
        mergePdf: resolve(__dirname, 'tools/merge-pdf/index.html'),
        splitPdf: resolve(__dirname, 'tools/split-pdf/index.html'),
        pdfToJpg: resolve(__dirname, 'tools/pdf-to-jpg/index.html'),
        // Image Tools
        imageIndex: resolve(__dirname, 'tools/image-tools/index.html'),
        imageCompressor: resolve(__dirname, 'tools/image-compressor/index.html'),
        resizeImage: resolve(__dirname, 'tools/resize-image/index.html'),
        jpgToPng: resolve(__dirname, 'tools/jpg-to-png/index.html'),
        // Calculators
        calcIndex: resolve(__dirname, 'tools/calculators/index.html'),
        ageCalculator: resolve(__dirname, 'tools/age-calculator/index.html'),
        percentageCalculator: resolve(__dirname, 'tools/percentage-calculator/index.html'),
        wordCounter: resolve(__dirname, 'tools/word-counter/index.html'),
        // Blog
        blogIndex: resolve(__dirname, 'blog/index.html'),
        article1: resolve(__dirname, 'blog/how-to-compress-pdfs.html'),
        article2: resolve(__dirname, 'blog/image-compression-guide.html'),
        article3: resolve(__dirname, 'blog/why-convert-jpg-to-png.html'),
        article4: resolve(__dirname, 'blog/word-count-tips.html'),
        article5: resolve(__dirname, 'blog/best-free-online-tools.html'),
        // Legal
        about: resolve(__dirname, 'about/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html')
      }
    }
  }
});
