import { normalizeResponses } from "./clean";

const rawData = [
  {
    "First name": "Ocilia",
    "Last name": "Rémot",
    "Email": "ocilia.remot@gmail.com",
    "Votre pays de résidence 🌍": "France",
    "Votre département 📌": "44 - Loire-Atlantique",
    "What country are you from ? 🌍": "",
    "Dans quel point relais souhaitez-vous retirer votre Passeport La Vélodyssée ?": "Office de Tourisme de Nantes Métropole",
    "À chacun son Passeport La Vélodyssée ! Vous voyagez en famille ou à plusieurs, il est possible de commander plusieurs Passeports La Vélodyssée. Combien de Passeport(s) souhaitez-vous commander ?": "2",
    "Quand souhaitez-vous récupérer votre Passeport La Vélodyssée ?": "2025-08-17T00:00:00.000Z",
    "Souhaitez-vous recevoir par e-mail l'actualité de La Vélodyssée ? 📬": 1,
    "Submit Date (UTC)": "2025-08-16T17:31:30Z"
  }
];

const clean = normalizeResponses(rawData);
console.log(clean);
