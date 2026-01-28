# vite-plugin-monaco-editor

一个简化 Monaco Editor 集成的 Vite 插件，支持自动 worker 处理和语言支持。

## 特性

- 自动注入 Monaco Editor worker 配置
- 按需加载语言 worker
- 预配置的依赖预构建，防止开发环境闪烁
- 支持多种语言的自动 worker 映射
- 灵活配置选项

## 安装

```bash
npm install -D @binran/vite-plugin-monaco-editor
# 或
yarn add -D @binran/vite-plugin-monaco-editor
# 或
pnpm add -D @binran/vite-plugin-monaco-editor
```

## 使用方法

### 基本用法

在你的 `vite.config.js` 或 `vite.config.ts` 中添加插件：

```js
import { defineConfig } from 'vite'
import monacoEditorWorkerPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  plugins: [
    monacoEditorWorkerPlugin()
  ]
})
```

### 高级配置

```js
import { defineConfig } from 'vite'
import monacoEditorWorkerPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  plugins: [
    monacoEditorWorkerPlugin({
      entry: 'src/main.ts',  // 注入代码的目标入口文件，默认: 'src/main.ts'
      languages: ['json', 'css', 'html', 'typescript'],  // 支持的语言
      debug: false  // 启用调试日志，默认: false
    })
  ]
})
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|--------|------|---------|-------------|
| `entry` | `string` | `'src/main.ts'` | 注入代码的目标入口文件 |
| `languages` | `string[]` | `['json', 'css', 'html', 'typescript']` | 支持的语言，例如 ['json', 'typescript', 'css', 'html'] |
| `debug` | `boolean` | `false` | 启用自定义控制台日志标识 |

支持的语言包括：`json`, `css`, `scss`, `less`, `html`, `handlebars`, `razor`, `typescript`, `javascript`。

## 工作原理

插件自动：

1. **注入 worker 配置代码** 到你指定的入口文件
2. **根据你指定的语言支持** 映射语言到对应的 worker
3. **处理依赖预构建** 以防止开发环境中的闪烁和错误
4. **优化 worker 加载** 通过避免相同 worker 的重复导入

注入的代码设置 Monaco Environment 以根据请求的语言动态加载 worker：

```js
/* --- Monaco Universal Plugin Start --- */
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// ... 其他语言 worker

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new JsonWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
    // ... 其他语言条件
    return new EditorWorker();
  }
};
/* --- Monaco Universal Plugin End --- */
```

## 示例设置

创建一个 Monaco Editor 组件：

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

## 支持的语言

插件目前支持以下语言及其对应的 worker：

- `json` → JSON Worker
- `css`, `scss`, `less` → CSS Worker (共享)
- `html`, `handlebars`, `razor` → HTML Worker (共享)
- `typescript`, `javascript` → TypeScript Worker (共享)

## 许可证

MIT
