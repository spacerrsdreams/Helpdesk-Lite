import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Plugin for optimized resource loading
    {
      name: "optimize-loading",
      transformIndexHtml(html) {
        // Convert CSS to async loading for non-blocking render
        html = html.replace(
          /<link rel="stylesheet" crossorigin href="([^"]*)">/g,
          `<link
       rel="preload"
       as="style"
       href="$1"
       onload="this.onload=null;this.rel='stylesheet'"
       crossorigin
     />
     <noscript><link rel="stylesheet" href="$1" crossorigin /></noscript>`,
        );

        // Remove non-critical modulepreload hints (notifications, virtual, radix, query)
        html = html
          .replace(/<link rel="modulepreload" crossorigin href="[^"]*notifications[^"]*">\s*/g, "")
          .replace(/<link rel="modulepreload" crossorigin href="[^"]*virtual[^"]*">\s*/g, "")
          .replace(/<link rel="modulepreload" crossorigin href="[^"]*radix[^"]*">\s*/g, "")
          .replace(/<link rel="modulepreload" crossorigin href="[^"]*query[^"]*">\s*/g, "");

        return html;
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      strict: false,
    },
    headers: {
      "Cache-Control": "no-cache",
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
  build: {
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        format: "esm",
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router"],
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-slot",
          ],
          query: ["@tanstack/react-query"],
          virtual: ["@tanstack/react-virtual"],
          form: ["react-hook-form", "@hookform/resolvers", "zod"],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
          icons: ["lucide-react"],
          state: ["zustand"],
          notifications: ["sonner", "cmdk"],
        },
      },
    },
    target: "esnext",
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router", "@tanstack/react-query", "zustand", "zod", "react-hook-form"],
  },
});
