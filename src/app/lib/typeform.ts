// src/app/lib/typeform.ts
import { fetchSupabaseResponses, type RawRow } from "./supabase-data";

// Re-export du type RawRow pour compatibilité
export type { RawRow } from "./supabase-data";

/**
 * Fonction principale pour récupérer les données du dashboard
 * Utilise maintenant Supabase comme source de données principale
 */
export async function fetchTypeformResponses(): Promise<RawRow[]> {
  return await fetchSupabaseResponses();
}

// Alias pour compatibilité avec le code existant
export { fetchTypeformResponses as fetchTypeformRows };