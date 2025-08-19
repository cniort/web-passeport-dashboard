// /src/lib/clean.ts

export type RawResponse = {
  "First name": string;
  "Last name": string;
  Email: string;
  "Votre pays de résidence 🌍"?: string;
  "What country are you from ? 🌍"?: string;
  "Votre département 📌"?: string;
  "Dans quel point relais souhaitez-vous retirer votre Passeport La Vélodyssée ?": string;
  "À chacun son Passeport La Vélodyssée ! Vous voyagez en famille ou à plusieurs, il est possible de commander plusieurs Passeports La Vélodyssée. Combien de Passeport(s) souhaitez-vous commander ?": number | string;
  "Quand souhaitez-vous récupérer votre Passeport La Vélodyssée ?": string;
  "Souhaitez-vous recevoir par e-mail l'actualité de La Vélodyssée ? 📬": number;
  "Submit Date (UTC)": string;
};

export type CleanResponse = {
  prenom: string;
  nom: string;
  email: string;
  pays: string;
  france: boolean;
  departement: string | null;
  pointRelais: string;
  quantite: number;
  dateRetrait: Date;
  newsletter: boolean;
  dateCommande: Date;
};

/**
 * Nettoie et normalise une réponse brute de Typeform.
 */
export function normalizeResponses(raw: RawResponse[]): CleanResponse[] {
  return raw.map((r) => {
    // Choix du pays (France si renseigné, sinon autre champ)
    const pays = r["Votre pays de résidence 🌍"]?.trim() || r["What country are you from ? 🌍"]?.trim() || "Inconnu";

    // Booléen France
    const france = pays.toLowerCase() === "france";

    // Nettoyage quantité
    const quantite = Number(r["À chacun son Passeport La Vélodyssée ! Vous voyagez en famille ou à plusieurs, il est possible de commander plusieurs Passeports La Vélodyssée. Combien de Passeport(s) souhaitez-vous commander ?"]) || 0;

    return {
      prenom: r["First name"]?.trim() || "",
      nom: r["Last name"]?.trim() || "",
      email: r.Email?.trim() || "",
      pays,
      france,
      departement: france ? (r["Votre département 📌"]?.trim() || null) : null,
      pointRelais: r["Dans quel point relais souhaitez-vous retirer votre Passeport La Vélodyssée ?"]?.trim() || "",
      quantite,
      dateRetrait: new Date(r["Quand souhaitez-vous récupérer votre Passeport La Vélodyssée ?"]),
      newsletter: r["Souhaitez-vous recevoir par e-mail l'actualité de La Vélodyssée ? 📬"] === 1,
      dateCommande: new Date(r["Submit Date (UTC)"]),
    };
  });
}
