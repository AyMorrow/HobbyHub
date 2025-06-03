import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, "../client")));

// Simple routes for preview
app.get("/api/auth/user", (req, res) => {
  res.status(401).json({ message: "Not authenticated" });
});

app.get("/api/teams", (req, res) => {
  res.json([]);
});

app.get("/api/leagues", (req, res) => {
  res.json([]);
});

// Serve the main page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const httpServer = createServer(app);

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Fantasy Sports Hub running on port ${port}`);
});