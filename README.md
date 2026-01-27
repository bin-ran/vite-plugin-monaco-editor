# vite-plugin-monaco-editor

A Vite plugin that simplifies the integration of Monaco Editor with automatic worker handling and language support.

[中文文档](./README_zh-CN.md) | [English Documentation](./README.md)

## Features

- Automatic injection of Monaco Editor worker configurations
- On-demand loading of language workers
- Pre-configured dependency pre-building to prevent flickering in development
- Support for multiple languages with automatic worker mapping
- Easy configuration with flexible options

## Installation

```bash
npm install @binran/vite-plugin-monaco-editor monaco-editor
# or
yarn add @binran/vite-plugin-monaco-editor monaco-editor
# or
pnpm add @binran/vite-plugin-monaco-editor monaco-editor
```

## Usage

### Basic Usage

Add the plugin to your `vite.config.js` or `vite.config.ts`:

```js
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  plugins: [
    monacoEditorPlugin()
  ]
})
```

### Advanced Configuration

```js
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  plugins: [
    monacoEditorPlugin({
      entry: 'src/main.ts',  // Entry file to inject code, default: 'src/main.ts'
      languages: ['json', 'css', 'html', 'typescript'],  // Supported languages
      debug: false  // Enable debug logging, default: false
    })
  ]
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entry` | `string` | `'src/main.ts'` | Target entry file to inject code |
| `languages` | `string[]` | `['json', 'css', 'html', 'typescript']` | Languages to support, e.g. ['json', 'typescript', 'css', 'html'] |
| `debug` | `boolean` | `false` | Enable custom console log identifier |

Supported languages include: `json`, `css`, `scss`, `less`, `html`, `handlebars`, `razor`, `typescript`, `javascript`.

## How It Works

The plugin automatically:

1. **Injects worker configuration code** into your specified entry file
2. **Maps languages to appropriate workers** based on the language support you specify
3. **Handles dependency pre-building** to prevent flickering and errors in development
4. **Optimizes worker loading** by avoiding duplicate imports of the same worker

The injected code sets up the Monaco Environment to dynamically load workers based on the language requested:

```js
/* --- Monaco Universal Plugin Start --- */
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// ... other language workers

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new JsonWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
    // ... other language conditions
    return new EditorWorker();
  }
};
/* --- Monaco Universal Plugin End --- */
```

## Example Setup

Create a Monaco Editor component:

```vue
<template>
  <div ref="editorContainer" style="width: 100%; height: 500px;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as monaco from 'monaco-editor'

const editorContainer = ref(null)
let editor = null

onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: '// Hello, world!\nconsole.log("Hello Monaco Editor");',
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
  })
})
</script>
```

## Supported Languages

The plugin currently supports the following languages with their corresponding workers:

- `json` → JSON Worker
- `css`, `scss`, `less` → CSS Worker (shared)
- `html`, `handlebars`, `razor` → HTML Worker (shared)
- `typescript`, `javascript` → TypeScript Worker (shared)

## License

MIT