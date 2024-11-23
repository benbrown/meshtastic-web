import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { execSync } from "node:child_process";
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'

let hash = "";

try {
  hash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (error) {
  hash = "DEV";
}

export default defineConfig({
  plugins: [pluginNodePolyfill(),pluginReact()],
  source: {
    define: {
      "process.env.COMMIT_HASH": JSON.stringify(hash),
    },
    alias: {
      "@app": "./src",
      "@pages": "./src/pages",
      "@components": "./src/components",
      "@core": "./src/core",
      "@layouts": "./src/layouts",
    },
  },
  output: {
    externals: {
      'serialport': '{}',
    },
  },
  html: {
    title: "Meshtastic Web",
  },
});
