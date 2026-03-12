# 06 API Contracts

## 1. Overview
Tooleva operates fundamentally as a static site. The MVP relies entirely on **Client-Side Libraries (WASM/JS)** rather than internal microservices or REST APIs. As such, there are **no internal API contracts** to define for data fetch operations.

## 2. In-Browser Module Interfaces (Virtual APIs)
Instead of HTTP REST endpoints, the "API" for Tooleva consists of standard Javascript Module exports for internal file processing.

### 2.1 PDF Processing Module Interface
*Library context: `pdf-lib`*

**`compressPdf(file: File) -> Promise<Blob>`**
- **Input:** standard HTML5 `File` object (MIME `application/pdf`).
- **Processing:** Analyzes streams, removes redundant object references.
- **Output:** Returns a `Blob` representing the compressed PDF.

**`mergePdfs(files: File[]) -> Promise<Blob>`**
- **Input:** Array of standard HTML5 `File` objects.
- **Processing:** Iterates and appends pages into a new PDFDocument instance.
- **Output:** Returns a `Blob` of the merged PDF.

### 2.2 Image Processing Module Interface
*Library context: `browser-image-compression`*

**`compressImage(file: File, options: Object) -> Promise<File>`**
- **Input:** 
  - `file`: standard HTML5 `File` object (`image/jpeg`, `image/png`).
  - `options`: `{ maxSizeMB: number, maxWidthOrHeight: number, useWebWorker: boolean }`.
- **Processing:** Resizes via canvas API.
- **Output:** Returns a compressed `File` object.

## 3. External API Integrations
The application consumes standard tracking pixel/script APIs externally. No backend proxy is used.

### 3.1 Google AdSense
- Loaded via global `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">`.
- Managed strictly through the AdSense Client ID.

### 3.2 Google Analytics (GA4)
- Tracking initialized via `gtag.js`.
- Custom events may be pushed for "Tool Executed Successfully" or "File Downloaded":
  ```javascript
  gtag('event', 'tool_usage', {
    'tool_category': 'pdf_tools',
    'tool_name': 'compress_pdf'
  });
  ```
