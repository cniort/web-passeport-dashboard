import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { fetchTypeformResponses } from "./typeform";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("⏳ Récupération des réponses Typeform...");
  const responses = await fetchTypeformResponses();
  console.log(`✅ ${responses.length} réponses récupérées.`);

  console.log("⏳ Insertion dans Supabase...");
  for (const r of responses) {
    const { error } = await supabase.from("responses").upsert(
      {
        prenom: r.prenom,
        nom: r.nom,
        email: r.email,
        pays: r.pays,
        france: r.france,
        departement: r.departement,
        point_relais: r.pointRelais,
        quantite: r.quantite,
        date_retrait: r.dateRetrait.toISOString(),
        newsletter: r.newsletter,
        date_commande: r.dateCommande.toISOString(),
        typeform_response_id: r.email + "_" + r.dateCommande.toISOString(), // clé unique temporaire
      },
      { onConflict: "typeform_response_id" }
    );

    if (error) {
      console.error("Erreur d’insertion :", error);
      break;
    }
  }

  console.log("🎉 Migration initiale terminée !");
}

main().catch((err) => console.error("Erreur générale :", err));
