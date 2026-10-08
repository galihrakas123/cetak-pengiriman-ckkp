import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  // server: {
  //   proxy: {
  //     "/generate_token": {
  //       target: "https://ebook.bapenda.jabarprov.go.id/", // Your API server address with .env file
  //       changeOrigin: false,
  //       secure: false,
  //     },
  //   },
  // },
});
