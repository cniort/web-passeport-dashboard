import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Charger .env.local
dotenv.config({ path: ".env.local" });

// Vérification des variables
console.log("URL Supabase:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + "...");
console.log("Service Key:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10) + "...");

// On récupère les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Sécurité : check si elles existent
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("❌ Variables d'environnement manquantes. Vérifie ton .env.local");
}

// On crée le client Supabase
const supabase = createClient(supabaseUrl.trim(), supabaseServiceRoleKey.trim());

async function testSupabase() {
  console.log("🔌 Test de connexion à Supabase...");

  // Étape 1 : Test simple d'insertion
  const { data: insertData, error: insertError } = await supabase
    .from("responses")
    .insert([
      {
        prenom: "Test",
        nom: "User",
        email: "test@example.com",
        pays: "France",
        france: true,
        departement: "17",
        point_relais: "Office Test",
        quantite: 1,
        date_retrait: new Date().toISOString(),
        newsletter: false,
        date_commande: new Date().toISOString(),
        typeform_response_id: "fake-id-123",
      },
    ])
    .select();

  if (insertError) {
    console.error("❌ Erreur d'insertion :", insertError.message);
    return;
  }

  console.log("✅ Insertion réussie :", insertData);

  // Étape 2 : Lire les dernières lignes
  const { data: rows, error: readError } = await supabase
    .from("responses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (readError) {
    console.error("❌ Erreur de lecture :", readError.message);
    return;
  }

  console.log("📊 Dernières réponses en base :", rows);
}

testSupabase();
