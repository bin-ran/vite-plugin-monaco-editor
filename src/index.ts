import { type Plugin } from "vite";
import path from "path";

interface MonacoPluginOptions {
  /** Target entry file to inject code, default is 'src/main.ts' */
  entry?: string;
  /** Languages to support, e.g. ['json', 'typescript', 'css', 'html'] */
  languages?: string[];
  /** Custom console log identifier */
  debug?: boolean;
}

// Mapping table of languages to Worker paths
const WORKER_MAP: Record<string, string> = {
  json: "monaco-editor/esm/vs/language/json/json.worker",
  css: "monaco-editor/esm/vs/language/css/css.worker",
  scss: "monaco-editor/esm/vs/language/css/css.worker",
  less: "monaco-editor/esm/vs/language/css/css.worker",
  html: "monaco-editor/esm/vs/language/html/html.worker",
  handlebars: "monaco-editor/esm/vs/language/html/html.worker",
  razor: "monaco-editor/esm/vs/language/html/html.worker",
  typescript: "monaco-editor/esm/vs/language/typescript/ts.worker",
  javascript: "monaco-editor/esm/vs/language/typescript/ts.worker",
};

export default function monacoUniversalPlugin(
  options: MonacoPluginOptions = {}
): Plugin {
  const {
    entry = "src/main.ts",
    languages = ["json", "css", "html", "typescript"],
    debug = false,
  } = options;

  // 1. Generate Worker import list based on configuration
  const getInjectionCode = () => {
    // Basic Editor Worker is required
    let imports = `import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';\n`;
    let getWorkerConditions = "";

    // Dynamically generate on-demand loading logic
    const uniqueWorkers = new Set<string>();

    languages.forEach((lang) => {
      const workerPath = WORKER_MAP[lang];
      if (workerPath) {
        const workerName = `${
          lang.charAt(0).toUpperCase() + lang.slice(1)
        }Worker`;
        // Avoid duplicate imports of the same Worker (e.g. ts and js share one)
        if (!uniqueWorkers.has(workerPath)) {
          imports += `import ${workerName} from '${workerPath}?worker';\n`;
          uniqueWorkers.add(workerPath);
        }

        // Generate conditional branches
        if (lang === "typescript" || lang === "javascript") {
          getWorkerConditions += `if (label === 'typescript' || label === 'javascript') return new ${workerName}();\n    `;
        } else if (["css", "scss", "less"].includes(lang)) {
          getWorkerConditions += `if (label === 'css' || label === 'scss' || label === 'less') return new ${workerName}();\n    `;
        } else if (["html", "handlebars", "razor"].includes(lang)) {
          getWorkerConditions += `if (label === 'html' || label === 'handlebars' || label === 'razor') return new ${workerName}();\n    `;
        } else {
          getWorkerConditions += `if (label === '${lang}') return new ${workerName}();\n    `;
        }
      }
    });

    return `
/* --- Monaco Universal Plugin Start --- */
${imports}
self.MonacoEnvironment = {
  getWorker(_, label) {
    ${getWorkerConditions}return new EditorWorker();
  }
};
/* --- Monaco Universal Plugin End --- */\n`;
  };

  return {
    name: "vite-plugin-monaco-universal",
    enforce: "pre",

    // 2. Automatically handle dependency pre-building to prevent flickering and errors in development environment
    config() {
      const include = [
        "monaco-editor/esm/vs/editor/editor.api",
        "monaco-editor/esm/vs/editor/editor.worker",
      ];
      languages.forEach((lang) => {
        if (WORKER_MAP[lang]) include.push(WORKER_MAP[lang]);
      });
      return {
        optimizeDeps: { include },
      };
    },

    // 3. Inject code to specified entry
    transform(code, id) {
      const normalizedEntry = path.normalize(entry);
      const normalizedId = path.normalize(id);

      if (normalizedId.endsWith(normalizedEntry)) {
        if (debug) console.log(`[monaco-universal] Injecting into ${id}`);
        return {
          code: getInjectionCode() + code,
          map: null,
        };
      }
    },
  };
}
