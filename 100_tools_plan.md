# Tooleva 100+ Tools Checklist & Scaling Plan

## Phase 1: Architecture & Scaling Prep
- [ ] **Technical Decision required:** The current working Tooleva app is a fast **Vite + Vanilla JS + HTML** static site. The new requirements mention **Next.js + TypeScript**. Decision needed: Should we migrate the entire existing site to Next.js/TS, or continue rapidly extending the existing Vite setup?
- [ ] Migrate existing components to React/Next.js (if selected) or establish modular Vanilla JS components.
- [ ] Define standard Tool Page layout/component wrapper (Upload/Input, Process, Result, FAQs, Ads, Related).

## Phase 2: Refactoring Existing Tools (10 tools)
- [ ] **PDF Tools:** Compress PDF, Merge PDF, Split PDF, PDF to JPG
- [ ] **Image Tools:** Image Compressor, Resize Image, Convert JPG to PNG
- [ ] **Calculators:** Age Calculator, Percentage Calculator, Word Counter

## Phase 3: Completing 10 Category Hubs
- [ ] Setup `tools/pdf-tools/index.html` (or Next.js pages)
- [ ] Setup `tools/image-tools/index.html`
- [ ] Setup `tools/video-tools/index.html` (New)
- [ ] Setup `tools/audio-tools/index.html` (New)
- [ ] Setup `tools/calculator-tools/index.html` 
- [ ] Setup `tools/text-tools/index.html` (New)
- [ ] Setup `tools/developer-tools/index.html` (New)
- [ ] Setup `tools/converter-tools/index.html` (New)
- [ ] Setup `tools/security-tools/index.html` (New)
- [ ] Setup `tools/utility-tools/index.html` (New)

## Phase 4: Remaining Target Tools (90 Tools)

### PDF Tools (6 New)
- [ ] PDF to PNG
- [ ] PDF to Word (Requires advanced extraction library or server if pure client fails)
- [ ] PDF to Excel (Complex client-side)
- [ ] PDF to PowerPoint
- [ ] PDF Rotator
- [ ] PDF Unlock

### Image Tools (7 New)
- [ ] Crop Image
- [ ] Rotate Image
- [ ] Convert PNG to JPG
- [ ] Convert WebP to JPG
- [ ] Image to Base64
- [ ] Blur Image
- [ ] Add Watermark

### Video Tools (10 New) - *Note: High browser compute load via FFmpeg.wasm*
- [ ] Video Compressor
- [ ] Trim Video
- [ ] Change Video Resolution
- [ ] Extract Audio
- [ ] Convert MP4 to GIF
- [ ] Rotate Video
- [ ] Change Video Speed
- [ ] Merge Videos
- [ ] Add Subtitle
- [ ] Convert Video Format

### Audio Tools (10 New) - *Note: Requires audio context / local processing*
- [ ] Audio Compressor
- [ ] Trim Audio
- [ ] Convert MP3 to WAV
- [ ] Change Audio Speed
- [ ] Merge Audio
- [ ] Extract Audio from Video
- [ ] Audio Volume Booster
- [ ] Noise Reduction
- [ ] Audio Cutter
- [ ] Audio Joiner

### Calculator Tools (7 New)
- [ ] Loan EMI Calculator
- [ ] BMI Calculator
- [ ] Discount Calculator
- [ ] Time Calculator
- [ ] Days Between Dates
- [ ] Scientific Calculator
- [ ] Tip Calculator
- [ ] Profit Margin Calculator

### Text Tools (9 New)
- [ ] Character Counter
- [ ] Case Converter
- [ ] Remove Duplicate Lines
- [ ] Remove Extra Spaces
- [ ] Text Sorter
- [ ] Random Text Generator
- [ ] Slug Generator
- [ ] Lorem Ipsum Generator
- [ ] Text Reverser

### Developer Tools (10 New)
- [ ] JSON Formatter
- [ ] JSON Validator
- [ ] Base64 Encoder
- [ ] Base64 Decoder
- [ ] URL Encoder
- [ ] URL Decoder
- [ ] HTML Minifier
- [ ] CSS Minifier
- [ ] JS Minifier
- [ ] Color Converter

### Converter Tools (10 New)
- [ ] Length Converter
- [ ] Weight Converter
- [ ] Temperature Converter
- [ ] Currency Converter (Requires live API)
- [ ] Speed Converter
- [ ] Area Converter
- [ ] Data Storage Converter
- [ ] Time Zone Converter
- [ ] Binary Converter
- [ ] Number Base Converter

### Security Tools (10 New)
- [ ] Password Generator
- [ ] Password Strength Checker
- [ ] Hash Generator
- [ ] MD5 Generator
- [ ] SHA256 Generator
- [ ] UUID Generator
- [ ] JWT Decoder
- [ ] Encryption Tool
- [ ] Decryption Tool
- [ ] Secure Text Tool

### Utility Tools (9 New)
- [ ] QR Code Generator
- [ ] Barcode Generator
- [ ] Random Number Generator
- [ ] Random Password Generator
- [ ] Random Name Generator
- [ ] Random Color Generator
- [ ] UUID Checker
- [ ] UUID Converter
- [ ] UUID Parser

## Phase 5: Advanced Optimization & Features
- [ ] Implement `robots.txt` and `sitemap.xml` automation for 100+ pages
- [ ] Implement robust SEO schema (`FAQPage`, `SoftwareApplication`) across all pages
- [ ] Refine the global UI layout for ad placements
- [ ] Generate standard "How to Use" blurbs dynamically for new tools
