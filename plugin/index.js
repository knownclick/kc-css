import path from "path";
import fs from "fs";
import { build } from "./builder.js";

/**
 * kf-css Vite Plugin
 * Automates the build process:
 * 1. Watches 'src/lib/kf-css/src/*.scss'
 * 2. Compiles Sass -> kf.css
 * 3. Generates Responsive -> kf-responsive.css
 */
export function kfCss(options = {}) {
  // Detect environment (SvelteKit vs Standard vs Local Dev)
  const root = process.cwd();

  // 1. Allow explicit override
  let baseDir = options.baseDir;

  if (!baseDir) {
    // 2. Check if we are in a SvelteKit project AND the src/lib/kf-css folder exists
    // This prevents forcing the path if the user is using the node_modules version directly
    const svelteKitPath = path.resolve(root, "src/lib/kf-css");
    if (
      fs.existsSync(path.resolve(root, "svelte.config.js")) &&
      fs.existsSync(svelteKitPath)
    ) {
      baseDir = "src/lib/kf-css";
    }

    // 3. Check if we are developing the library locally (kf-css repo)
    if (!baseDir) {
      try {
        const pkgPath = path.resolve(root, "package.json");
        if (fs.existsSync(pkgPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
          if (pkg.name === "kf-css") {
            baseDir = ".";
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    // 4. Fallback to kf-css (node_modules resolution or root)
    if (!baseDir) {
      baseDir = "kf-css";
      // If we can't find it locally, we assume it's in node_modules/kf-css
      // But 'kf-css' as a relative path resolves to {root}/kf-css.
      // If that doesn't exist, we might want to try to find the package path.
      if (!fs.existsSync(path.resolve(root, baseDir))) {
        try {
          // Try to find the module root
          // This is a bit hacky but works for many setups
          const mainPath = require.resolve("kf-css");
          // mainPath is .../kf-css/plugin/index.js
          // we want .../kf-css
          baseDir = path.dirname(path.dirname(mainPath));
          // Make it relative to root for consistency if possible, or keep absolute
          baseDir = path.relative(root, baseDir);
        } catch (e) {
          // consume error
        }
      }
    }
  }

  const defaults = {
    entry: path.join(baseDir, "src/main.scss"), // Use join for safer paths
    outDir: path.join(baseDir, "dist"),
  };

  const config = { ...defaults, ...options };

  return {
    name: "kf-css-automator",

    // 0. Resolve the virtual import to the actual file
    resolveId(id) {
      if (id === "virtual:kf-css") {
        return path.resolve(process.cwd(), config.outDir, "kf-responsive.css");
      }
    },

    // 1. Build on server start (Development)
    async buildStart() {
      try {
        const root = process.cwd();
        const entryPath = path.resolve(root, config.entry);
        const outPath = path.resolve(root, config.outDir);

        await build(entryPath, outPath);
      } catch (e) {
        console.error("[kf-css] Initial build failed:", e.message);
      }
    },
  };
}
