import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node, // use Node globals, not browser
      sourceType: "commonjs", // commonjs for require/module.exports
    },
    rules: {
      "no-console": "off", // keep console.log for server logging
      semi: ["error", "always"], // enforce semicolons
    },
  },
]);
