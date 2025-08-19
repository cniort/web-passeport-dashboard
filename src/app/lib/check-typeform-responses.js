const TYPEFORM_API_TOKEN = process.env.TYPEFORM_API_TOKEN;

const RESPONSE_IDS = [
  "mrcjr1hazkrejaivdam8h3mrcjst0bbs", // Caroline
  "qa6hhct82zz7h53pczqa6hrlojh81ena", // Hugo
  "ov704ejz0mf09f1vixfov704ej2abcpd", // Abdel
];

for (const id of RESPONSE_IDS) {
  const url = `https://api.typeform.com/forms/YOJXD9z6/responses?included_response_ids=${id}`;

  console.log(`🔎 Checking response: ${id}`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!res.ok) {
    console.error(`❌ Failed for ${id}:`, res.status, await res.text());
    continue;
  }

  const data = await res.json();

  console.dir(data.items?.[0]?.answers, { depth: null });
}
