import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // The INTENT / SHIFT design code (spa/) was written against oxlint. These three rules
  // only flag copy style (literal quotes, "//" labels in JSX text) and Math.random()
  // used once inside useMemo for 3D particle layouts, so they are relaxed there only.
  {
    files: ["spa/**/*.{ts,tsx}"],
    rules: {
      "react/no-unescaped-entities": "off",
      "react/jsx-no-comment-textnodes": "off",
      "react-hooks/purity": "off",
      // matchMedia subscriptions that set the initial reduced-motion value in an effect
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
