# kf-css

**Strictly designed for Svelte & SvelteKit.**

A modern, efficient, and **Just-In-Time (JIT)** CSS framework tailored for SvelteKit.

## The "Mirror" Responsive System

kf-css uses a unique "Mirror" system to handle responsiveness without bloating your Sass compilation time.

### How it works

1.  **Sass Compilation**: core Sass files generate the base CSS (mobile-first utilities and components).
2.  **The Mirror**: A post-processing script (`bin/mirror.js`) automatically generates responsive variants for **every single class** in your CSS.
    - Input: `.p-4`
    - Output: `.m:p-4`, `.l:p-4`, `.xl:p-4` (wrapped in appropriate media queries).
3.  **Zero Config**: Any custom class you add (e.g. `.sexycard`) gets responsive variants for free (`.m:sexycard`).

### Supported Breakpoints

- **`m:`** (768px)
- **`l:`** (992px)
- **`xl:`** (1400px)

## Usage

**kf-css** is designed to be fully owned by you. Instead of importing from `node_modules`, you scaffold the entire source code into your project.

### 1. Initialize

Run the following command in your project root:

```bash
npx kf-css
```

- **SvelteKit**: Automatically detects SvelteKit and installs to `src/lib/kf-css`.
- **Other Projects**: Installs to `./kf-css`.

### 2. Import

### SvelteKit Setup (Recommended)

Since `kf-css` is scaffolded into your project, you must set up the build pipeline to generate the CSS.

**1. Install Dependencies**
You need `sass` to compile the core files.

```bash
npm install -D sass
```

**2. Add Build Scripts**
In your project's `package.json`, add scripts to compile the styles and run the mirror.

```json
"scripts": {
  "kf:build": "sass src/lib/kf-css/src/main.scss src/lib/kf-css/dist/kf.css && node src/lib/kf-css/bin/mirror.js src/lib/kf-css/dist/kf.css src/lib/kf-css/dist/kf-responsive.css",
  "kf:watch": "onchange 'src/lib/kf-css/src/**/*.scss' -- npm run kf:build"
}
```

_(Optional: Install `onchange` via `npm i -D onchange` for the watch script)_

**3. Import CSS**
In `src/routes/+layout.svelte` (or your root layout):

```svelte
<script>
  import '$lib/kf-css/dist/kf-responsive.css';
</script>
```

**4. Development Workflow**
When you edit files in `src/lib/kf-css/config`, run `npm run kf:build` (or start the watcher) to regenerate your styles.

---

### Other Frameworks

## Customization

You now own the code! Explore the `kf-css` folder:

### 1. Configuration (`src/config/`)

Ideally, you only need to touch files in this folder to theme your site.

- **`_colors.scss`**: Define your color palette and theme generation settings.
- **`_typography.scss`**: Font families, sizes, and scale settings.
- **`_layout.scss`**: Breakpoints, container widths, and generic layout settings.
- **`_forms.scss`**: Input sizing, border widths, and focus ring settings.
- **`_custom.scss`**: **<-- Start here!** Define variables for your own custom components effectively extending the system.

### 2. Components (`src/components/`)

- **`_custom.scss`**: Write your own component styles here using variables from `config/_custom.scss`.
- `_buttons.scss`, `_forms.scss`: Core framework components (feel free to modify, but standard practice is to leave them be).

### 3. Main Entry

- **`main.scss`**: implementation loop. Toggle specific modules on/off if you don't need them.

## Handling Collisions (Known Issues)

- **`.block` Class**: The framework defines a semantic layout component `.block` (display: flex) AND a utility class `.block` (display: block).
  - **Advice**: If you use `<div class="block">`, the utility usually wins. If you need the semantic flex behavior, ensure the utility isn't overriding it, or use valid utility alternatives like `.flex` or specific `d-flex` classes if you add them.

## Post-Processing (Optimization)

Since `kf-css` is compiled by your project's bundler (Vite), you get automatic optimizations.

### Purging Unused CSS

To remove unused CSS in production, we recommend `vite-plugin-purgecss`.

**Install:**

```bash
npm install -D vite-plugin-purgecss
```

**Configure (`vite.config.js`):**

```js
import purgeCss from "vite-plugin-purgecss";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), purgeCss({})],
});
```
