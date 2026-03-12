# 04 System Architecture

## 1. Architectural Philosophy
Tooleva adopts a **Static-First, Client-Side Processing Architecture**. 
To reduce server costs, maximize scalability, and ensure the highest possible user privacy, files are never uploaded to a backend server. Instead, all manipulations (PDF modifications, image compression) happen directly within the user's browser using WebAssembly or optimized JavaScript libraries.

## 2. High-Level Diagram

```text
[ User Browser ]
   |
   |-- 1. Requests pages -> [ Vercel CDN (Static Hosting) ]
   |                        (Serves HTML, CSS, JS)
   |
   |-- 2. Loads Ads      -> [ Google AdSense Network ]
   |
   |-- 3. Analytics      -> [ Google Analytics ]
   |
   |-- 4. In-Browser File Processing
          | -> pdf-lib / PDF.js (PDF Manipulation)
          | -> browser-image-compression (Image shrinking)
          | -> Vanilla JS (Calculations & Text operations)
          | -> Local Blob URL Generation for File Download
```

## 3. Core Components

### 3.1 Frontend Layer
The presentation logic is purely static.
- **HTML5:** Semantic markup focused heavily on accessibility and SEO.
- **Tailwind CSS:** Utility-first framework ensuring rapid UI development, maintaining a small CSS footprint and responsive layouts.
- **Vanilla JavaScript / Lightweight Framework:** Orchestrates the UI states (uploading, processing, downloading).

### 3.2 Processing Engine (Client-Side)
This is where the heavy lifting occurs without a traditional backend.
- **PDF Manipulation:** Relying on robust libraries like `pdf-lib` to read, merge, compress, and output PDFs on the client thread.
- **Image Processing:** Using HTML5 `<canvas>` and libraries like `browser-image-compression` to resize and compress images locally before offering them back as a `Blob` download.
- **Calculators:** Standard synchronous mathematical manipulations executed entirely in the client window.

### 3.3 Hosting & Delivery
- **Provider:** Vercel (or Cloudflare Pages).
- **Delivery Strategy:** Files are compiled into static assets and distributed globally via a Content Delivery Network (CDN), assuring near-instant TTFB (Time To First Byte).

## 4. Key Advantages
- **Zero Compute Costs:** Because processing runs on the user's machine, server overhead is virtually non-existent, maximizing Ad revenue ROI.
- **High Security & Privacy:** Since files never leave the browser, GDPR/CCPA compliance in document handling is trivial. No leaked documents.
- **Infinite Scalability:** Traffic spikes do not crash a backend processor since static CDNs can handle massive concurrent loads effortlessly.
