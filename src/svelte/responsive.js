/**
 * Generates a responsive class string for kf-css.
 *
 * @param {string} baseClasses - The base classes to apply at all sizes.
 * @param {Object.<string, string>} breakpoints - An object mapping breakpoint names (keys) to class strings (values).
 * @returns {string} The combined class string with prefixes.
 *
 * @example
 * responsive('p-4', { m: 'p-6', l: 'p-8' })
 * // Returns: "p-4 m:p-6 l:p-8"
 */
export function responsive(baseClasses, breakpoints = {}) {
  let result = baseClasses || "";

  for (const [key, value] of Object.entries(breakpoints)) {
    if (value) {
      if (result) result += " ";
      result += `${key}:${value}`;
    }
  }

  return result;
}
