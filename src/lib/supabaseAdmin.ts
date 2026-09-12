import { createClient } from '@supabase/supabase-js';

// Server-only: bypasses RLS. Never import this from a client-hydrated (.tsx) component.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
