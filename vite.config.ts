import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import presetWind from "@unocss/preset-wind";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/bookstore",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    UnoCSS({
      presets: [presetWind()],
      shortcuts: {
        "nav-link":
          "text-black no-underline transition-colors hover:bg-gray-200 hover:text-blue-800",
        "inline-link": "py-0 px-4",
        "btn-link": "h-9 leading-9 rounded",
        "block-link": "px-4 py-3",
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
      {
        find: "assets",
        replacement: resolve(__dirname, "src/assets"),
      },
      {
        find: "vue-i18n",
        replacement: "vue-i18n/dist/vue-i18n.cjs.js", // Resolve the i18n warning issue
      },
      {
        find: "vue",
        replacement: "vue/dist/vue.esm-bundler.js", // compile template
      },
    ],
    extensions: [".ts", ".js"],
  },
  define: {
    "process.env": {},
  },
});
