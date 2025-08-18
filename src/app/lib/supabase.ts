// src/app/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client utilisé côté navigateur (sécurisé, pas accès aux clés sensibles)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
