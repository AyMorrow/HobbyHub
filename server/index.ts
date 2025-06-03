import express from "express";
import { registerRoutes } from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
  const httpServer = await registerRoutes(app);
  
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Fantasy Sports Hub running on port ${port}`);
  });
}

startServer().catch(console.error);