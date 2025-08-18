import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { fetchTypeformResponses } from "./typeform";

async function main() {
  try {
    const responses = await fetchTypeformResponses();

    console.log("✅ Connexion API Typeform réussie !");
    console.log("Nombre total de réponses récupérées :", responses.length);

    if (responses.length > 0) {
      console.log("\n👉 Exemple de première réponse normalisée :");
      console.log(JSON.stringify(responses[0], null, 2));
    }
  } catch (error) {
    console.error("❌ Erreur lors du fetch Typeform :", error);
  }
}

main();
