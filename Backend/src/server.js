import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import snippetRoutes from "./routes/snippetRoutes.js";
import { createNewUser, signin } from "./handlers/user.js";
import authRoutes from "./routes/authRoutes.js";
import hubRoutes from "./routes/hubRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./modules/authMiddleware.js";
import prisma from "./prisma/index.js";
dotenv.config();
const app = express();

// Configuration CORS et autres middlewares de base
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Configuration de la session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialisation de Passpo rt
app.use(passport.initialize());

// Logger personnalisé pour la production
const logger = (req, res, next) => {
  // En production, logger uniquement les erreurs et les requêtes importantes
  if (process.env.NODE_ENV === "production") {
    // Logger les erreurs (status >= 400)
    res.on("finish", () => {
      if (res.statusCode >= 400) {
        console.error(
          `[ERROR] ${req.method} ${req.url} - Status: ${res.statusCode}`
        );
      }
    });
  } else {
    // En développement, logger toutes les requêtes de manière concise
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
};

// Appliquer le logger avant les routes
app.use(logger);

// Routes publiques (non protégées)
app.post("/user", createNewUser);
app.post("/signin", signin);
app.use("/auth", authRoutes);
app.get("/ping", async (req, res) => {
  try {
    // Effectuer une requête simple pour garder la connexion active
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).send("pong");
  } catch (error) {
    console.error("Erreur lors du ping:", error);
    res.status(500).send("Erreur serveur");
  }
});

// Middleware d'authentification global pour toutes les routes suivantes
app.use(authenticateToken);

// Routes protégées (APRÈS le middleware d'authentification)
app.use("/snippets", snippetRoutes);
app.use("/hub", hubRoutes);
app.use("/users", userRoutes);

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    // En production, logger uniquement l'erreur sans les détails
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ message: "Erreur serveur" });
  } else {
    // En développement, logger l'erreur complète
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
