import express from "express";
import cors from "cors";
import { createServer } from "http";
import router from "./routes";
import { setupVite, serveStatic } from "./vite"; // 👈 import these

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api", router);

const start = async () => {
  if (process.env.NODE_ENV === "production") {
    serveStatic(app); // Serve built client
  } else {
    await setupVite(app, server); // Use Vite middleware in dev
  }

  server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
};

start();