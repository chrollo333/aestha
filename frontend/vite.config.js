import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // Vite's default port
        proxy: {
            "/api": {
                target: "http://127.0.0.1:5000", // Flask Backend
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""), // Removes "/api" before sending request
            },
        },
    },
});