const fs = require("fs-extra");
const path = require("path");

function injectViteConfig(rootPath, config = {}) {
  // 1. Try to find the file
  let viteFile = path.join(rootPath, "vite.config.js");
  if (!fs.existsSync(viteFile)) {
    const viteTsFile = path.join(rootPath, "vite.config.ts");
    if (fs.existsSync(viteTsFile)) {
      viteFile = viteTsFile;
    } else {
      // File doesn't exist, create it
      const defaultContent = `import { defineConfig } from 'vite';
import { kfCss } from 'kf-css';

export default defineConfig({
  plugins: [kfCss()]
});
`;
      try {
        fs.writeFileSync(viteFile, defaultContent);
        return { success: true, file: "vite.config.js (created)" };
      } catch (e) {
        return {
          success: false,
          reason: "Failed to create vite.config.js: " + e.message,
        };
      }
    }
  }

  try {
    let content = fs.readFileSync(viteFile, "utf8");

    // 2. Check if already imported
    if (content.includes("kfCss") && content.includes("kf-css")) {
      return { success: true, alreadyExists: true };
    }

    // 3. Prepare Import Statement
    // If customized, we might strictly need arguments, but usually simple import is fine.
    // NOTE: If the user needs custom config (non-standard path), we should probably NOT auto-inject
    // or inject with the params. For now, assume standard or simple inject.
    const importStmt = `import { kfCss } from 'kf-css';`;

    // 4. Inject Import
    // 4. Inject Import
    // Simple robust strategy: Prepend to top
    content = importStmt + "\n" + content;

    // 5. Inject Plugin
    // Look for plugins: [ ... ]
    const pluginsRegex = /(plugins:\s*\[)/;
    if (pluginsRegex.test(content)) {
      // If plugins array exists, insert at the beginning of it
      content = content.replace(
        pluginsRegex,
        `$1\n\t\tkfCss(${JSON.stringify(config.params || {})}),`
      );
    } else {
      // If plugins array missing? (Hard to robustly fix, might just fail gracefully)
      // Or look for defineConfig({ ... }) and try to insert plugins property.
      // For safety, let's only do it if 'plugins: [' exists.
      return {
        success: false,
        reason: "Could not find plugins array in config",
      };
    }

    // Clean up double commas or weird formatting if possible (simple regex replacement can be messy)
    // But basic valid JS usually survives.

    fs.writeFileSync(viteFile, content);
    return { success: true, file: path.basename(viteFile) };
  } catch (e) {
    return { success: false, reason: e.message };
  }
}

module.exports = { injectViteConfig };
