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

  let baseDir = "kf-css";

  // Check if we are in a SvelteKit project
  if (fs.existsSync(path.resolve(root, "svelte.config.js"))) {
    baseDir = "src/lib/kf-css";
  }

  // Check if we are developing the library locally (kf-css repo)
  try {
    const pkgPath = path.resolve(root, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      if (pkg.name === "kf-css") {
        baseDir = ".";
      }
    }
  } catch (e) {
    // Ignore error, fallback to defaults
  }

  const defaults = {
    entry: `${baseDir}/src/main.scss`,
    outDir: `${baseDir}/dist`,
    watch: `${baseDir}/src/**/*.scss`,
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

    // 2. Watch for changes
    configureServer(server) {
      const watcher = server.watcher;
      const root = process.cwd();

      // Resolve the watch pattern to a directory path for checking
      const watchPathAbs = path.resolve(root, config.watch);
      // Remove glob patterns to get the base directory
      // e.g. /path/to/src/**/*.scss -> /path/to/src
      const watchDir = watchPathAbs
        .substring(0, watchPathAbs.indexOf("*"))
        .replace(/[/\\]$/, "");

      // Add watch pattern
      watcher.add(watchPathAbs);

      console.log(`[kf-css] Watching: ${watchPathAbs}`);

      watcher.on("change", async (file) => {
        // Normalize file path
        const normalizedFile = file.split(path.sep).join("/");
        const normalizedWatchDir = watchDir.split(path.sep).join("/");

        // Check if the modified file is within our watch directory and is an SCSS file
        if (
          normalizedFile.startsWith(normalizedWatchDir) &&
          normalizedFile.endsWith(".scss")
        ) {
          console.log(`[kf-css] Change detected: ${path.basename(file)}`);

          try {
            const entryPath = path.resolve(root, config.entry);
            const outPath = path.resolve(root, config.outDir);

            // Re-run the builder
            await build(entryPath, outPath, true); // true = silent logs (cleaner dev console)

            // Trigger HMR
            // We invalidate the generated CSS file so Vite reloads it
            const cssFile = path.resolve(outPath, "kf-responsive.css");
            const mod = server.moduleGraph.getModuleById(cssFile);

            if (mod) {
              server.moduleGraph.invalidateModule(mod);
              server.ws.send({
                type: "full-reload",
                path: "*",
              });
              console.log("[kf-css] HMR Update triggered.");
            } else {
              // Try to find module by URL if ID lookup failed (Vite idiosyncrasies)
              // Or just force a reload anyway
              server.ws.send({
                type: "full-reload",
                path: "*",
              });
              console.log(
                "[kf-css] HMR Update triggered (Module not found in graph)."
              );
            }
          } catch (e) {
            console.error("[kf-css] Rebuild failed:", e.message);
          }
        }
      });
    },
  };
}
