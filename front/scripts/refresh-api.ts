import { generateApi } from "@elyspio/vite-eslint-config/api/generate";
import path from "node:path";
import fs from "node:fs";

const apiUrl = process.env.SWAGGER_URL || "https://localhost:16000/swagger/v1/swagger.json";

const outputFolder = path.resolve("src", "core", "apis", "rest", "api", "generated");

await generateApi(apiUrl, outputFolder, "Backend");

await fs.promises.rm(path.resolve(outputFolder, "docs"), { recursive: true, force: true });
