import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monacoUniversalPlugin from "../dist/index";

export default defineConfig(() => {
  return {
    root: "./",
    plugins: [
      vue(),
      monacoUniversalPlugin({
        languages: ["json"],
        debug: false,
      }),
    ],
  };
});
