// eslint.i18n.config.mjs — flat ESLint config used ONLY by the WorldReady literal counter
// (scripts/count-literals.mjs), not by the app's own lint. It reports hard-coded,
// user-visible strings in JSX text and in the four user-visible attributes.
//
// This config (and the counter) are authored by Claude Code, never by IBM Bob:
// "the checker is not written by the agent it grades."
//
// Rule: i18next/no-literal-string in `jsx-only` mode, so it flags:
//   - JSX text nodes  (e.g.  <p>Book Your Flight</p>)
//   - the attributes placeholder / alt / title / aria-label ONLY
// It deliberately does NOT flag className, `to`, `type`, etc. (via jsx-attributes.include),
// and in jsx-only mode it ignores non-JSX string literals (plain JS/TS). Hard-coded strings
// in toast() calls and in src/data/*.ts are counted separately by the AST passes in
// count-literals.mjs, so there is no double counting.

import i18next from 'eslint-plugin-i18next';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { i18next },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-only',
          'jsx-attributes': {
            include: ['placeholder', 'alt', 'title', 'aria-label'],
          },
        },
      ],
    },
  },
];
