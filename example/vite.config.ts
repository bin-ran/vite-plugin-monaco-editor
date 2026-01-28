import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monacoEditorWorkerPlugin from "../src/index";

export default defineConfig(() => {
  return {
    root: "example",
    plugins: [
      vue(),
      monacoEditorWorkerPlugin({
        languages: ["json"],
        debug: false,
      }),
    ],
  };
});
