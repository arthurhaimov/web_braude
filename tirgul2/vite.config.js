import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        login: resolve(import.meta.dirname, "src/login.html"),
        register: resolve(import.meta.dirname, "src/register.html"),
        userManagement: resolve(import.meta.dirname, "src/userManagement.html")
      }
    }
  }
});
