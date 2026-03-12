# 12 Testing Strategy

## 1. Objectives
The testing strategy for Tooleva ensures that tool outputs are deterministic, browser processing limits handle realistic file sizes without crashing the user tab, and the static site remains ultra-fast for SEO purposes.

## 2. Core Testing Levels

### 2.1 Unit Testing (Utility Logic)
Testing the pure JavaScript manipulation functions independently of the UI.
- **Scope:** Math logic (calculators), string regex logic (word counter).
- **Tooling:** Minimal setup, e.g., Jest or Vitest.
- *Note:* We will mock `pdf-lib` or use controlled static testing inputs to ensure the wrapper logic performs correctly.

### 2.2 Manual UX / QA Testing
Since core functionality relies on native browser capabilities (FileReader API, Canvas API), manual cross-browser testing is critical.
- **Browsers Covered:** Chrome, Safari, Firefox, Edge, (Desktop & Mobile viewports).
- **Test Cases:**
  1. Uploading a 50MB PDF for compression (stress test).
  2. Uploading unsupported formats (ensuring graceful error messages).
  3. Drag and drop functionality verification across OS platforms.
  4. File download integrity (can the downloaded file be opened natively?).

### 2.3 Performance & SEO Testing (Automated Lighthouse)
Because Tooleva's growth relies on SEO, performance regressions must be caught instantly.
- **Mechanism:** Running Google Lighthouse on critical pages natively utilizing unthrottled desktop/mobile simulations.
- **Fail Conditions:**
  - LCP (Largest Contentful Paint) > 2.5s.
  - CLS (Cumulative Layout Shift) > 0.1 (critically checking Ad placeholders).
  - Accessibility Score < 95.

### 2.4 Security Testing
Given client-side processing, traditional server pen-testing is largely bypassed. 
- Focus remains on preventing Cross-Site Scripting (XSS) in calculator inputs.
- Ensuring users cannot upload executable scripts through image upload modules.
