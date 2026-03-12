# 07 Monorepo Structure

## 1. Standard Static Site Layout

Tooleva operates within a simple, component-driven repository, heavily relying on static HTML/CSS/JS and potentially structured by a lightweight build tool (like Vite or Webpack) or simply vanilla structure for Vercel deployment.

```text
tooleva/
├── .github/                   # GitHub Actions (if any CI/CD logic required)
├── public/                    # Static uncompiled assets (robot.txt, sitemap.xml)
│   ├── assets/
│   │   ├── images/            # Global UI icons, logos
│   │   └── fonts/             # Custom typography
│   ├── sitemap.xml            # SEO crucial file
│   └── robots.txt
├── src/
│   ├── css/
│   │   └── tailwind.css       # Main Tailwind entrypoint
│   ├── js/
│   │   ├── core/
│   │   │   ├── analytics.js   # GA initialization and event pushing
│   │   │   └── ads.js         # Adblock detection or ad management
│   │   ├── tools/
│   │   │   ├── pdf/           # Logic invoking pdf-lib
│   │   │   ├── image/         # Logic invoking browser-image-compression
│   │   │   └── calculators/   # Vanilla JS math modules
│   │   └── ui/
│   │       ├── dropzone.js    # Drag-and-drop unified UI logic
│   │       └── notifications.js 
│   ├── pages/                 # HTML templates
│   │   ├── index.html         # Homepage
│   │   ├── tools/
│   │   │   ├── index.html     # Tools category overview
│   │   │   ├── pdf-tools/     
│   │   │   ├── image-tools/
│   │   │   └── calculators/
│   │   ├── blog/              # Blog index and static markdown or HTML posts
│   │   ├── about.html
│   │   └── contact.html
│   └── components/            # Reusable HTML snippets (Header, Footer, Nav)
├── package.json               # Tracks devDependencies (Tailwind, Vite, ESLint)
├── tailwind.config.js         # Tailwind styling themes
├── vite.config.js             # If using Vite for rapid compilation/minification
└── README.md
```

## 2. Continuous Deployment
- Pushes to the `main` branch trigger Vercel to perform an immediate deploy.
- The Vercel build command simply runs CSS tree-shaking and minification (e.g., `npm run build` compiling Tailwind).
- Output directory `dist/` is deployed to the edge CDN.
