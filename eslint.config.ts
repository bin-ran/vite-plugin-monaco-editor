import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    plugins: {},
    rules: {},
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
]);
