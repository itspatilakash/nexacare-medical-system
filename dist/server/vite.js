// server/vite.ts
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viteLogger = createLogger();
export function serveStatic(app) {
    const distPath = path.resolve(__dirname, "../dist/client");
    if (!fs.existsSync(distPath)) {
        throw new Error(`Could not find the built client: ${distPath}`);
    }
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}
export async function setupVite(app, server) {
    const clientRoot = path.resolve(__dirname, "../client");
    const vite = await createViteServer({
        root: clientRoot,
        server: {
            middlewareMode: true,
            hmr: { server },
        },
        appType: "custom",
        customLogger: {
            ...viteLogger,
            error: (msg, options) => viteLogger.error(msg, options),
        },
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
        const url = req.originalUrl;
        try {
            const clientTemplate = path.resolve(clientRoot, "index.html");
            let template = await fs.promises.readFile(clientTemplate, "utf-8");
            const html = await vite.transformIndexHtml(url, template);
            res.status(200).set({ "Content-Type": "text/html" }).end(html);
        }
        catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });
}
