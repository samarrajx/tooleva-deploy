import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync, statSync } from "fs";

function getHtmlFiles(dir) {
  const files = {};

  function scan(folder) {
    const items = readdirSync(folder);

    items.forEach((item) => {
      const fullPath = resolve(folder, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (item.endsWith(".html")) {
        const name = fullPath
          .replace(process.cwd(), "")
          .replace(/^\/+/, "")
          .replace(".html", "")
          .replace(/\//g, "_");

        files[name] = fullPath;
      }
    });
  }

  scan(dir);
  return files;
}

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: getHtmlFiles(process.cwd())
    }
  }
});
