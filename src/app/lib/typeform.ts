import { normalizeResponses, CleanResponse, RawResponse } from "./clean";
import "dotenv/config";

const TYPEFORM_API_URL = "https://api.typeform.com/forms";

export async function fetchTypeformResponses(): Promise<CleanResponse[]> {
  const formId = process.env.TYPEFORM_FORM_ID;
  const token = process.env.TYPEFORM_API_TOKEN;

  if (!formId || !token) {
    throw new Error("TYPEFORM_FORM_ID ou TYPEFORM_API_TOKEN manquant dans .env.local");
  }

  let allItems: any[] = [];
  let before: string | null = null;

  while (true) {
    const url = new URL(`${TYPEFORM_API_URL}/${formId}/responses`);
    url.searchParams.set("page_size", "1000"); // max autorisé
    if (before) {
      url.searchParams.set("before", before);
    }

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erreur API Typeform: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      break;
    }

    allItems = allItems.concat(data.items);

    // Curseur pour page suivante (on prend le dernier response_id du batch)
    before = data.items[data.items.length - 1].token;

    // Si on a atteint le total annoncé par Typeform, on peut arrêter
    if (data.total_items && allItems.length >= data.total_items) {
      break;
    }
  }

  // Mapping brut → RawResponse[]
  const rawResponses: RawResponse[] = allItems.map((item: any) => {
    const answers: Record<string, any> = {};
    item.answers.forEach((a: any) => {
      answers[a.field.ref] = a[a.type];
    });

    return {
      "First name": answers["a902f5cd-7713-4a88-b2a2-634889cc149b"] || "",
      "Last name": answers["2c112d55-d015-4b16-abbb-ef7a13baf0bf"] || "",
      Email: answers["b9f94473-a504-4092-9d17-88c6301fec2b"] || "",
      "Votre pays de résidence 🌍":
        answers["9af37d76-64bc-42a9-890b-96416088a5ed"]?.label === "France" ? "France" : "",
      "What country are you from ? 🌍": answers["bbf87d44-a48b-4535-83b6-31ee50bad183"] || "",
      "Votre département 📌": undefined, // à compléter si champ présent
      "Dans quel point relais souhaitez-vous retirer votre Passeport La Vélodyssée ?":
        answers["85905483-614d-4312-9abf-17a7e2052650"] || "",
      "À chacun son Passeport La Vélodyssée ! Vous voyagez en famille ou à plusieurs, il est possible de commander plusieurs Passeports La Vélodyssée. Combien de Passeport(s) souhaitez-vous commander ?":
        answers["73ff69a7-edee-4dec-8b45-de1e605fd7c0"] || 0,
      "Quand souhaitez-vous récupérer votre Passeport La Vélodyssée ?":
        answers["04d98058-a265-4616-8ca1-83288b1e503e"] || "",
      "Souhaitez-vous recevoir par e-mail l'actualité de La Vélodyssée ? 📬":
        answers["66ac0cff-3c1e-44f9-adc7-e08871f3a7bb"] ? 1 : 0,
      "Submit Date (UTC)": item.submitted_at || "",
    };
  });

  return normalizeResponses(rawResponses);
}
