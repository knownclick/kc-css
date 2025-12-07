const fs = require("fs");
const path = require("path");

// Configuration
const BREAKPOINTS = [
  { prefix: "m", minWidth: "768px" },
  { prefix: "l", minWidth: "992px" },
  { prefix: "xl", minWidth: "1400px" },
];

const INPUT_FILE = process.argv[2] || "dist/kf.css";
const OUTPUT_FILE = process.argv[3] || "dist/kf-responsive.css";

function main() {
  const inputPath = path.resolve(INPUT_FILE);
  const outputPath = path.resolve(OUTPUT_FILE);

  console.log(`Reading CSS from: ${inputPath}`);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const cssContent = fs.readFileSync(inputPath, "utf8");

  // Simple Regex to capture complete CSS rules:
  // .classname { ... }
  // We explicitly avoid @media blocks and keyframes for simplicity in this version,
  // assuming kf.css is a flat list of utility classes.
  // Regex:
  // (^\s*\.[a-zA-Z0-9_\-]+(?::[a-zA-Z0-9_\-]+)*)\s*\{([^}]+)\}
  // Group 1: Selector (must start with dot)
  // Group 2: Body

  // Note: This regex is "good enough" for utility frameworks but not a full CSS parser.
  const regex = /(^\s*\.[a-zA-Z0-9_\-]+(?::[a-zA-Z0-9_\-]+)*)\s*\{([^}]+)\}/gm;

  // Prepend the base CSS so the output file is a self-contained bundle
  let responsiveCSS = cssContent + "\n\n/* Generated Responsive Utilities */\n";

  BREAKPOINTS.forEach((bp) => {
    responsiveCSS += `\n/* --- Breakpoint: ${bp.prefix} (${bp.minWidth}) --- */\n`;
    responsiveCSS += `@media (min-width: ${bp.minWidth}) {\n`;

    let match;
    let count = 0;

    // Reset regex for each pass
    regex.lastIndex = 0;

    while ((match = regex.exec(cssContent)) !== null) {
      const originalSelector = match[1].trim(); // e.g. ".p-4"
      const body = match[2].trim(); // e.g. "padding: 1rem;"

      // Create new selector: .m\:p-4
      // We escape the colon for CSS syntax: .m\:p-4
      const className = originalSelector.substring(1); // remove leading dot
      const newSelector = `.${bp.prefix}\\:${className}`;

      responsiveCSS += `  ${newSelector} { ${body} }\n`;
      count++;
    }

    responsiveCSS += `}\n`;
    console.log(`  Included ${count} classes for prefix '${bp.prefix}:'`);
  });

  fs.writeFileSync(outputPath, responsiveCSS);
  console.log(`\nSuccess! Wrote responsive variants to: ${outputPath}`);
}

main();
