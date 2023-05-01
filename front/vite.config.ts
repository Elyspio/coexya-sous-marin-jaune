import { getDefaultConfig } from "@elyspio/vite-eslint-config/vite/vite.config";
import { defineConfig } from "vite";

const config = getDefaultConfig(__dirname);

export default defineConfig((env) => ({ ...config, base: env.command === "build" ? "/coexya/burgers" : undefined }));
