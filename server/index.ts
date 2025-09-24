import express from "express";
import cors from "cors";
import { createServer } from "http";
import router from "./routes";
import { setupVite, serveStatic } from "./vite";

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// API routes first
app.use("/api", router);

const start = async () => {
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

start();