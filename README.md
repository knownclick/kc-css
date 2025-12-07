<div align="center">

# kf-css

**A modern, efficient CSS framework tailored for SvelteKit.**  
_Lightweight. Semantic. Customizable._

</div>

---

## 🚀 Features

- **SvelteKit First**: Designed with SvelteKit's architecture in mind.
- **Automated**: Custom Vite plugin updates styles instantly as you edit.
- **Responsive**: Mirror utility that automatically generates responsive variants (e.g. `.m:p-4`).
- **Semantic**: Built on a solid design system of colors, typography, and spacing.
- **Customizable**: Built with Sass, easily configured via variables.

---

## 📦 Installation

**Option 1: Scaffold (Recommended for SvelteKit)**

Run the setup wizard to copy the source files and build scripts into your project. This gives you full control and enables the auto-responsive generator.

```bash
npx kf-css
```

**Option 2: Install as Dependency**

Install the package to use the pre-built CSS or Sass files directly from `node_modules`.

```bash
npm install kf-css
```

This will:

1. Copy the `src` and `bin` files to your project (default: `src/lib/kf-css`).
2. Guide you through the necessary integration steps.

---

## 🛠️ Integration

### SvelteKit Setup

After running `npx kf-css`, you need to hook it up:

1.  **Install Sass**:

    ```bash
    npm install -D sass
    ```

2.  **Configure Vite**:
    Import the `kfCss` plugin in your `vite.config.js` to enable auto-rebuilding.

    ```javascript
    // vite.config.js
    import { sveltekit } from "@sveltejs/kit/vite";
    import { defineConfig } from "vite";
    import { kfCss } from "./src/lib/kf-css/bin/vite-plugin.js"; // Adjust path if needed

    export default defineConfig({
      plugins: [sveltekit(), kfCss()],
    });
    ```

3.  **Import Styles**:
    In your root layout (e.g. `src/routes/+layout.svelte`), import the **generated** responsive CSS.

    ```svelte
    <script>
      import '$lib/kf-css/kf-responsive.css';
    </script>

    <slot />
    ```

### Manual Usage (Non-SvelteKit)

If you aren't using SvelteKit or the CLI, you can install the package directly:

```bash
npm install kf-css
```

Then import the pre-built CSS file:

```javascript
import "kf-css/dist/kf.css";
// Or for responsive variants (if generated manually):
import "kf-css/responsive";
```

**Sass Usage**:

```scss
@use "kf-css/sass" as kf;
```

---

## 🎨 Customization

The framework is configured via Sass variables in `src/config/`.

1.  **Colors**: Edit `config/colors.scss` to define your palette.
2.  **Typography**: Adjust `config/typography.scss` for font stacks and scales.
3.  **Breakpoints**: Modify `config/layout.scss`.

The `bin/mirror.js` script reads your CSS variables (specifically `--breakpoint-*`) to generate responsive classes.

---

## 🖥️ Development Scripts

If you have the source locally:

- **Build**: Compiles Sass and generates responsive utilities.
  ```bash
  npm run build
  ```
- **Minify**: Creates a compressed version.
  ```bash
  npm run build:min
  ```

---

## 📄 License

MIT
