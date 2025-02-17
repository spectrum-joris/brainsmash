import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importeer routes
import authRoutes from "./routes/authRoutes.js";
import databaseRoutes from "./routes/databaseRoutes.js";
import frontendRoutes from "./routes/frontendRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// nodig voor __dirname in ES modules ; we gebruiken __dirname in de server.js file om de frontend te serveren (anders moeten we live server op index.html gebruiken)
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// **Statische bestanden correct serveren**
app.use(express.static(path.join(__dirname, "../frontend")));

// **Gebruik de routes**
app.use("/", frontendRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/database", databaseRoutes); 
app.use("/api/quizzes", quizRoutes);
app.use("/api/profile", profileRoutes);

// **Catch-all route om 404 te voorkomen en alles naar index.html te leiden**
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/login.html"));
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));
