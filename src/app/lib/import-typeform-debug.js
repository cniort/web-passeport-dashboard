import dotenv from "dotenv";
import path from "path";

console.log("📂 Current working dir:", process.cwd());
console.log("📂 Chemin attendu:", path.resolve(process.cwd(), ".env.local"));

// Charge le .env.local depuis la racine du projet
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("🔑 TYPEFORM_API_TOKEN:", process.env.TYPEFORM_API_TOKEN ? "OK" : "❌ MISSING");
console.log("🔑 TYPEFORM_FORM_ID:", process.env.TYPEFORM_FORM_ID ? "OK" : "❌ MISSING");

const typeformToken = process.env.TYPEFORM_API_TOKEN;
const formId = process.env.TYPEFORM_FORM_ID;

if (!typeformToken || !formId) {
  console.error("❌ Manque TYPEFORM_API_TOKEN ou TYPEFORM_FORM_ID");
  process.exit(1);
}

async function run() {
  console.log("🚀 Test des réponses Typeform pour 'quantite'");

  const url = `https://api.typeform.com/forms/${formId}/responses?page_size=5`; // juste 5 pour debug
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${typeformToken}` },
  });

  if (!res.ok) {
    console.error("❌ Erreur API:", res.status, res.statusText);
    return;
  }

  const data = await res.json();

  data.items.forEach((r) => {
    console.log(`Réponse ID: ${r.response_id}`);

    const quantiteAnswer = r.answers.find((a) => a.field?.id === "bFI5BeajmlU5");
    if (quantiteAnswer) {
      console.log("➡️ Quantité trouvée:", quantiteAnswer.number);
    } else {
      console.log("❌ Pas de quantité trouvée dans cette réponse");
    }
  });
}

run().catch(console.error);
