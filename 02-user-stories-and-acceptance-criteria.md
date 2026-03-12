# 02 User Stories and Acceptance Criteria

## 1. PDF Tools

### US1: Compress PDF
**As a** student or office worker,
**I want to** upload a large PDF and compress it,
**So that** I can easily share or email the file within attachment size limits.
- **Acceptance Criteria:**
  - User can drag and drop or select a `.pdf` file.
  - Compression happens locally in the browser.
  - A progress indicator is shown during processing.
  - User can see original vs. new file size.
  - User can download the processed file.

### US2: Merge PDF
**As a** professional,
**I want to** combine multiple PDF files into a single document,
**So that** I have a single consolidated file to present or share.
- **Acceptance Criteria:**
  - User can select multiple PDF files.
  - User can reorder the selected files before merging.
  - Upon clicking "Merge", the system generates a single PDF.
  - Download triggers immediately upon completion.

### US3: PDF to JPG
**As a** content creator,
**I want to** extract pages from a PDF as images,
**So that** I can use them in presentations or social media.
- **Acceptance Criteria:**
  - User uploads a PDF.
  - System converts each page to a separate JPG file (or a ZIP of JPGs if there are multiple pages).
  - High resolution is maintained.

## 2. Image Tools

### US4: Image Compressor
**As a** web developer,
**I want to** shrink image sizes locally without losing noticeable quality,
**So that** my websites load faster.
- **Acceptance Criteria:**
  - Accommodates `.png`, `.jpg`, and `.jpeg`.
  - Compression runs fully in-browser via JavaScript libraries.
  - Outputs file size comparison.
  - Allows direct download of the optimized image.

### US5: JPG to PNG Conversion
**As a** general user,
**I want to** swap my image format from JPG to PNG,
**So that** I meet upload requirements for specific platforms.
- **Acceptance Criteria:**
  - Accepts a JPG file.
  - Processes instantly and offers a PNG download.

## 3. Calculators & Utilities

### US6: Word Counter
**As a** writer,
**I want to** paste text into a box and instantly see word and character counts,
**So that** I can ensure I meet writing constraints.
- **Acceptance Criteria:**
  - Offers a large HTML text area.
  - Updates counts (Words, Characters, Paragraphs) in real-time as the user types or pastes.
  - No server-side POST request required.

### US7: Age & Percentage Calculators
**As a** general user,
**I want to** input my date of birth or basic numbers,
**So that** I can get an instant calculated result.
- **Acceptance Criteria:**
  - Simple form inputs with instant (on-change) validation and calculation results.
  - Clear, readable output UI.

## 4. General Platform & Monetization

### US8: Cross-Device Access
**As an** on-the-go user,
**I want to** smoothly use the tools on my mobile phone,
**So that** I don't need to hunt for a laptop.
- **Acceptance Criteria:**
  - UI is fully responsive.
  - Buttons have adequate touch-targets.
  - Header and ad banners adapt to screen width seamlessly.

### US9: Seamless Ad Integration
**As the** platform owner,
**I want to** display Google AdSense ads in non-intrusive ways,
**So that** I can monetize the traffic without destroying the user experience.
- **Acceptance Criteria:**
  - Ad containers are rendered in reserved spaces to prevent Cumulative Layout Shift (CLS).
  - Banners are positioned logically (below headers, below results).
