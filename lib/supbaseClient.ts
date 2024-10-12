// lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Server-Side
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseApiKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseApiKey) {
  throw new Error('Missing Supabase URL or API Key');
}

export const supabaseServer = createClient(supabaseUrl, supabaseApiKey);

// Client-Side
const supabasePublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabasePublicUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Public URL or Anon Key');
}

export const supabaseClient = createClient(supabasePublicUrl, supabaseAnonKey);
