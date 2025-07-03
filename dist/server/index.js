import express from "express";
import cors from "cors";
import morgan from "morgan";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { errorHandler } from "./middleware/errorHandler";
const app = express();
// Global Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Enhanced Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse;
    const originalResJson = res.json.bind(res);
    res.json = (bodyJson, ...args) => {
        capturedJsonResponse = bodyJson;
        return originalResJson(bodyJson, ...args);
    };
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            if (logLine.length > 80)
                logLine = logLine.slice(0, 79) + "…";
            log(logLine);
        }
    });
    next();
});
// Mount all routes
(async () => {
    const server = await registerRoutes(app);
    // Global error handler
    app.use(errorHandler);
    // Development Vite server
    if (app.get("env") === "development") {
        await setupVite(app, server);
    }
})();
