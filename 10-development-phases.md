# 10 Development Phases

## Phase 1: Foundation & UI System (Week 1)
- Initialize Git repository and standard project structure.
- Configure Tailwind CSS.
- Design and build the base layout (Header, Nav, Footer, Hero Section).
- Set up the static routing structure (or HTML directory map).

## Phase 2: Core Utility Modules - PDF Tools (Week 1-2)
- Implement `pdf-lib` integration.
- Build "Compress PDF" UI and logic.
- Build "Merge PDF", "Split PDF", and "PDF to JPG" tools.
- Test cross-browser compatibility for heavy blob generation.

## Phase 3: Image Tools & Calculators (Week 2)
- Implement `browser-image-compression`.
- Build Image Compressor, Resize Image, and Format Shifter.
- Implement vanilla JS logic for Age Calculator, Percentage Calculator, and Word Counter.
- Unify tool UIs (consistent drag-and-drop zones, loading states).

## Phase 4: Content & SEO Architecture (Week 3)
- Build out the Blog index and article templates.
- Write and format 5 initial blog articles.
- Implement global SEO tags, specific meta descriptions per tool, and schema markup (e.g., `SoftwareApplication` or `WebApplication` schema).
- Generate `sitemap.xml` and `robots.txt`.

## Phase 5: Tracking & Monetization Integrations (Week 3)
- Inject Google Analytics scripts.
- Reserve ad-slots in layouts and inject AdSense tags.
- Verify ad placements do not cause layout shifts (Core Web Vitals compliance).

## Phase 6: Testing, Optimization & Launch (Week 4)
- Perform Lighthouse audits on all pages. Maximize scores (aiming for 90+ on performance/SEO).
- Deploy to Vercel production environment.
- Map custom domain (`tooleva.com`).
- Submit to Google Search Console for indexing.
