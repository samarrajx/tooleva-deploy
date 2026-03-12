# 11 Environment and DevOps

## 1. Environments

Since Tooleva operates as a static site, environment complexity is minimal.

- **Development (Local):** 
  - Engineers run a local development server (e.g., `npx serve` or `npm run dev` if using Vite/Tailwind CLI).
  - Draft content and experimental layouts reside here.

- **Staging / Preview (Vercel Preview):**
  - Triggered automatically when opening a Pull Request in GitHub.
  - Vercel provisions a unique Preview URL for stakeholder testing.

- **Production (Vercel Prod):**
  - Triggered upon merging to the `main` branch.
  - Deploys static assets to edge CDNs globally.
  - Bound to the primary domain `tooleva.com`.

## 2. CI/CD Pipeline
If utilizing Vercel's out-of-the-box GitHub integration:
1. **Developer pushes code** to a feature branch.
2. **Vercel triggers Build:** Executes Tailwind build steps (e.g., `npm run build`).
3. **Vercel deploys** to Preview URL.
4. **Code Merged:** Production rebuild and cache invalidation across edge nodes.

## 3. Environment Variables
Local `.env` and Vercel Environment variables will be sparse, but might include:
- `NEXT_PUBLIC_GA_ID` (If tracking ID needs to differ across environments).
- `ADSENSE_CLIENT_ID`.

*(Note: because the app is entirely client-side, all environment variables prefixed for client exposure will be visible in the source. Thus, no secure secrets or private API keys will be stored or handled by the frontend).*
