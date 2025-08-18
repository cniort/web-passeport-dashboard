import dotenv from "dotenv";

// Charge explicitement .env.local
dotenv.config({ path: ".env.local" });

console.log("✅ Fichier .env.local chargé");

import { createClient } from '@supabase/supabase-js';

console.log("URL Supabase:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Service Key:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,10) + "...");

// === CONFIG ===
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const typeformToken = process.env.TYPEFORM_API_TOKEN!;
const formId = process.env.TYPEFORM_FORM_ID!; // ton ID de formulaire Typeform

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importTypeformResponses() {
  console.log("🚀 Début de l'import depuis Typeform...");

  let totalImported = 0;
  let hasMore = true;
  let before: string | undefined = undefined;

  while (hasMore) {
    // --- 1. Construire l’URL avec pagination
    let url = `https://api.typeform.com/forms/${formId}/responses?page_size=1000`;
    if (before) url += `&before=${before}`;

    // --- 2. Récupérer un bloc de réponses
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${typeformToken}` },
    });
    if (!res.ok) {
      throw new Error(`Erreur API Typeform: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();

    const responses = data.items || [];
    console.log(JSON.stringify(responses[0], null, 2));
    if (responses.length === 0) {
      hasMore = false;
      break;
    }

// Debug : afficher les réponses complètes pour analyser les champs
responses.forEach((r: any) => {
  r.answers.forEach((a: any) => {
    console.log(`${a.field?.ref} (${a.type}) ->`, a.text || a.email || a.boolean || a.number || a.date);
  });
});

// --- 3. Transformer et insérer dans Supabase
const rows = responses.map((r: any) => {
  const franceAnswer = r.answers?.find(
    (a: any) => a.field?.ref === "9af37d76-64bc-42a9-890b-96416088a5ed"
  );

  console.log("👉 FRANCE RAW:", JSON.stringify(franceAnswer, null, 2));

  r.answers.forEach((a: any) => {
  if (a.field?.ref === "73ff69a7-edee-4dec-8b45-de1a56885887f") {
    console.log("👉 QUANTITE RAW:", JSON.stringify(a, null, 2));
  }
});

  return {
    typeform_response_id: r.response_id,

    // Identité
    prenom: r.answers?.find((a: any) => a.field?.ref === "a902f5cd-7713-4a88-b2a2-634889cc149b")?.text || null,
    nom: r.answers?.find((a: any) => a.field?.ref === "2c112d55-d015-4b16-abbb-ef7a13baf0bf")?.text || null,
    email: r.answers?.find((a: any) => a.field?.ref === "b9f94473-a504-4092-9d17-88c6301fec2b")?.email || null,

    // Localisation
    france: franceAnswer ? (franceAnswer.choice?.label === "France") : null,
    departement: r.answers?.find((a: any) => a.field?.ref === "8e3e826d-8686-432f-8c69-d1a56885887f")?.text || null,
    pays: r.answers?.find((a: any) => a.field?.ref === "bbf87d44-a48b-4535-83b6-31ee50bad183")?.text || null,

    // Passeport
    point_relais: r.answers?.find((a: any) => a.field?.ref === "85905483-614d-4312-9abf-17a7e2052650")?.text || null,
    quantite: r.answers?.find((a: any) => a.field?.id === "bFI5BeajmlU5")?.number || null,
    date_retrait: r.answers?.find((a: any) => a.field?.ref === "04d98058-a265-4616-8ca1-83288b1e503e")?.date || null,

    // Newsletter
    newsletter: r.answers?.find((a: any) => a.field?.ref === "66ac0cff-3c1e-44f9-adc7-e08871f3a7bb")?.boolean ?? null,

    // Métadonnées
    date_commande: r.submitted_at,
  };
});

    const { error } = await supabase.from("responses").upsert(rows, {
      onConflict: "typeform_response_id",
    });

    if (error) {
      console.error("❌ Erreur insertion Supabase:", error);
      break;
    }

    totalImported += responses.length;
    console.log(`✅ ${responses.length} réponses importées (Total: ${totalImported})`);

    // --- 4. Préparer la page suivante
    before = responses[responses.length - 1]?.token; // Typeform donne un curseur "token"
    if (!before) {
      hasMore = false;
    }
  }

  console.log(`🎉 Import terminé. Total: ${totalImported} réponses`);
}

// Lancer le script
importTypeformResponses().catch(console.error);
