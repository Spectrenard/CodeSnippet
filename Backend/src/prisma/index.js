import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function connectWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Test de connexion simple
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Connexion établie au démarrage");
      return true;
    } catch (error) {
      console.log(
        `⏳ Tentative ${i + 1}/${maxRetries} - La base se réveille...`
      );
      // Attendre plus longtemps entre chaque tentative
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  throw new Error("❌ Impossible de se connecter après plusieurs tentatives");
}

// Initialisation avec retry
connectWithRetry().catch((error) => {
  console.error("Erreur de connexion:", error);
  process.exit(1);
});

export default prisma;
