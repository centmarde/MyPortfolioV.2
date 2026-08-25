import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// NOTE: The react-dev-inspector (@vitejs/plugin-react babel plugin +
// inspectorServer) was removed. Its babel plugin injects
// data-inspector-line / data-inspector-column / data-inspector-relative-path
// attributes into EVERY JSX element at build time. Combined with
// @react-three/fiber v9's custom React 19 reconciler, those attributes break
// three.js host element handling and cause runtime crashes such as
// "Cannot set properties of undefined (setting 'line')".

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: '/',
    server: {
      proxy: {
        '/api/counterapi': {
          target: 'https://api.counterapi.dev',
          changeOrigin: true,
          rewrite: (path) => `/v2${path.replace(/^\/api\/counterapi/, '')}`,
        },
      },
    },
  };
});
