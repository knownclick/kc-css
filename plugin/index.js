import path from "path";
import { build } from "./builder.js";

/**
 * kf-css Vite Plugin
 * Automates the build process:
 * 1. Watches 'src/lib/kf-css/src/*.scss'
 * 2. Compiles Sass -> kf.css
 * 3. Generates Responsive -> kf-responsive.css
 */
export function kfCss(options = {}) {
  // Define defaults based on standard scaffolding structure
  const defaults = {
    // Where we look for the user's Sass entry point
    entry: "src/lib/kf-css/src/main.scss",
    // Where we output the CSS (so the user can see it or import it physically if they want)
    outDir: "src/lib/kf-css/dist",
    // Watch pattern
    watch: "src/lib/kf-css/src/**/*.scss",
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

      // Add watch pattern
      watcher.add(path.resolve(root, config.watch));

      watcher.on("change", async (file) => {
        // Check if the modified file matches our watch scope
        // We normalize paths to forward slashes for easier comparison
        const normalizedFile = file.split(path.sep).join("/");

        // Simple check: is it in the kf-css src folder?
        // You might want a stronger check using glob matching if needed
        if (
          normalizedFile.includes("kf-css/src") &&
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
            }
          } catch (e) {
            console.error("[kf-css] Rebuild failed:", e.message);
          }
        }
      });
    },
  };
}
