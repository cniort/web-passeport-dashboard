// src/app/config/typeform.ts
export const typeformConfig = {
  formId: process.env.NEXT_PUBLIC_TYPEFORM_FORM_ID ?? "",
  token: process.env.TYPEFORM_TOKEN ?? "",
  // Mappe TES clés de champs Typeform → noms internes utilisés dans lib/typeform.ts
  fieldMap: {
    orderDate: "orderDate",   // ex: "date_de_commande"
    passports: "passports",   // ex: "nb_passeports"
    relay: "relay",           // ex: "point_relais"
    country: "country",       // ex: "pays"
    newsletter: "newsletter", // ex: "optin_newsletter"
  },
} as const;
