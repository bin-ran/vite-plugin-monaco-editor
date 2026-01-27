<template>
  <div class="editor" ref="editorEl"></div>
</template>

<script setup lang="ts">
import "monaco-editor/esm/nls.messages.zh-cn.js";
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/language/json/monaco.contribution.js";
import { onMounted, useTemplateRef } from "vue";

const editorEl = useTemplateRef("editorEl");

onMounted(() => {
  const editor = monaco.editor.create(editorEl.value!, {
    value: "",
    language: "json",
    automaticLayout: true,
    autoIndent: "advanced",
    theme: "vs-dark",
    minimap: {
      enabled: true,
    },
  });
});
</script>

<style scoped>
.editor {
  width: 100vw;
  height: 100vh;
}
</style>
