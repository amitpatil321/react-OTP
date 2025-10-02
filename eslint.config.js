import js from "@eslint/js"
import prettierConfig from "eslint-config-prettier"
import importPlugin from "eslint-plugin-import"
import jsxA11y from "eslint-plugin-jsx-a11y"
import prettierPlugin from "eslint-plugin-prettier"
// import prettier from "eslint-plugin-prettier/recommended"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    // specify the formats on which to apply the rules below
    files: ["**/*.{ts,tsx}"],
    // use predefined configs in installed eslint plugins
    extends: [
      // js
      js.configs.recommended,
      // ts
      ...tseslint.configs.recommended,
      // react
      react.configs.flat.recommended,
      // import
      importPlugin.flatConfigs.recommended,
      // a11y (accessibility
      jsxA11y.flatConfigs.recommended,
      // prettier
      prettierConfig
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    // specify used plugins
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin
    },
    settings: {
      // for eslint-plugin-react to auto detect react version
      react: {
        version: "detect"
      },
      // for eslint-plugin-import to use import alias
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json"
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".svg"],
          paths: ["public"]
        }
      }
    },
    rules: {
      // set of custom rules
      quotes: ["error", "double"],
      "no-console": "warn",
      "react/button-has-type": "error",
      "react/react-in-jsx-scope": ["off"],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
    }
  }
)
