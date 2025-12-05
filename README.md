# KC-CSS

A modern, efficient CSS framework tailored for SvelteKit.

## Installation

Install the package via npm: (coming soon)

```bash
npm install kc-css
```

You will also need `sass` installed in your project:

```bash
npm install -D sass
```

## Using with SvelteKit

### 1. Global Styles

To use the full framework globally, import the main SCSS file in your root layout:

**`src/routes/+layout.svelte`**:

```svelte
<script>
  import 'kc-css/src/main.scss';
</script>

<slot />
```

### 2. Component Usage

If you need to access variables or mixins in a specific component:

```svelte
<style lang="scss">
  @use "kc-css/src/config/colors";

  .my-element {
    color: colors.$primary;
  }
</style>
```

## Optimization (Safe PurgeCSS)

For production, we recommend using `vite-plugin-purgecss` to automatically remove unused utility classes.

**Crucial**: You must **safelist** standard HTML tags to prevent base styles (typography, resets) from being purged, as they might not appear explicitly in your `.svelte` files.

### Recommended `vite.config.ts`

```javascript
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { purgeCss } from "vite-plugin-purgecss";

export default defineConfig({
  plugins: [
    sveltekit(),
    purgeCss({
      safelist: {
        // 1. Keep all standard HTML tags (base styles)
        standard: [
          "html",
          "body",
          /^h\d/, // h1, h2, etc.
          /^p$/,
          /^ul$/,
          /^ol$/,
          /^li$/,
          /^table/,
          /^tr/,
          /^td$/,
          /^th$/,
          /^blockquote$/,
          /^pre$/,
          /^code$/,
          /^input$/,
          /^button$/,
          /^form$/,
        ],
        // 2. Keep specific dynamic patterns if needed
        greedy: [
          // /red$/ // Example: keeps any class ending in "red"
        ],
      },
    }),
  ],
});
```

### Dynamic Classes Warning

PurgeCSS statically analyzes your code. It **cannot** see classes constructed at runtime:

```javascript
// ❌ WRONG: PurgeCSS won't see "width-100"
const size = 100;
const className = `width-${size}`;

// ✅ CORRECT: Use full strings
const className = isFull ? "width-100" : "width-50";
```

If you must use dynamic construction, you need to add a safelist pattern to your config:

```javascript
purgeCss({
  safelist: {
    greedy: [
      /^width-/, // Keeps anything starting with "width-"
    ],
  },
});
```
