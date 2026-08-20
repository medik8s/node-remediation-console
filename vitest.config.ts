import { defineConfig, type Plugin } from "vitest/config";
import path from "path";

function stubCss(): Plugin {
  return {
    name: "stub-css",
    enforce: "pre",
    resolveId(source) {
      if (source.endsWith(".css")) return "\0stub-css";
    },
    load(id) {
      if (id === "\0stub-css") return "export default {}";
    },
  };
}

export default defineConfig({
  plugins: [stubCss()],
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    server: {
      deps: {
        inline: [/@patternfly\//],
      },
    },
  },
  resolve: {
    alias: {
      apis: path.resolve(__dirname, "src/apis"),
      components: path.resolve(__dirname, "src/components"),
      copiedFromConsole: path.resolve(__dirname, "src/copiedFromConsole"),
      data: path.resolve(__dirname, "src/data"),
      hooks: path.resolve(__dirname, "src/hooks"),
      localization: path.resolve(__dirname, "src/localization"),
      navigation: path.resolve(__dirname, "src/navigation"),
    },
  },
});
