# 03 Information Architecture

## 1. Global Sitemap

The site follows a flat, search-engine-friendly structure, aimed at bringing traffic directly to the tools they need.

```text
/
├── /tools
│   ├── /pdf-tools
│   │   ├── /compress-pdf
│   │   ├── /merge-pdf
│   │   ├── /split-pdf
│   │   └── /pdf-to-jpg
│   ├── /image-tools
│   │   ├── /image-compressor
│   │   ├── /resize-image
│   │   └── /jpg-to-png
│   └── /calculators
│       ├── /age-calculator
│       ├── /percentage-calculator
│       └── /word-counter
├── /blog
│   ├── /article-1 (e.g., "Top 5 Ways to Compress PDFs Free")
│   └── /article-2
├── /about
├── /contact
├── /privacy-policy
└── /terms
```

## 2. Page Templates

### 2.1 Homepage
- **Hero Section:** Clear tagline ("Free Tools for Everyday Work") and a search bar or quick links to top tools.
- **Categories Grid:** Cards highlighting "PDF Tools", "Image Tools", etc.
- **Popular Tools:** Direct links to the top 4-5 most used tools.
- **Footer:** Links to legal docs, contact page, and blog.

### 2.2 Tool Category Layout (e.g. `/tools/pdf-tools`)
- **Category Header:** SEO-optimized H1 tag and detailed description.
- **Tool Listing:** Grids or lists of available tools under that specific category.

### 2.3 Individual Tool Layout
Every tool page follows a strict, conversion-optimized structure:
1. **Title (H1) & Meta:** Very clear, keyword-targeted (e.g., "Merge PDF Online Free").
2. **Tool Workbench Engine:**
   - Dropzone / Input section.
   - Processing button.
   - Output/Result section with Download button.
3. **Ad Container:** Non-intrusive placement for AdSense.
4. **How-To / Instructions (H2):** 3-step text guiding users on how to use the tool.
5. **SEO/FAQ Content (H2/H3):** Expandable FAQs answering common search queries to capture long-tail SEO.
6. **Related Tools:** Cross-linking to boost engagement (e.g., linking "Compress PDF" from the "Merge PDF" page).

### 2.4 Blog Structure
- **Blog Index:** List of recent posts (aiming for 5 posts for MVP).
- **Article Page:** Heavy text layout, inline relevant tool links, sidebar for AdSense or popular tools.
