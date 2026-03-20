import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only initialize if we have real-looking credentials
export const isSupabaseConfigured = 
  supabaseUrl !== "" && 
  supabaseUrl !== "https://placeholder.supabase.co" && 
  supabaseKey !== "" && 
  supabaseKey !== "placeholder";

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder.supabase.co", 
  isSupabaseConfigured ? supabaseKey : "placeholder"
);
