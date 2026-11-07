import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials with trimming to prevent whitespace issues
const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).trim();

// Support both the modern Supabase Publishable Key (sb_pub_...) and standard Anon Key
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  ''
).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('your-supabase') &&
  !supabaseKey.includes('your-anon-key') &&
  !supabaseKey.includes('your-publishable-key')
);

// Diagnostic console messaging
if (isSupabaseConfigured) {
  console.log('%c[Supabase] Active & Configured!%c Connecting to ' + supabaseUrl, 'color: #22c55e; font-weight: bold', 'color: #94a3b8');
} else {
  console.warn(
    '[Supabase] Not configured or keys missing in this build. Running in offline/demo mode.\n' +
    'Note: If you just added environment variables in Netlify, you MUST trigger a new build:\n' +
    'Netlify -> Deploys -> Trigger deploy -> Clear cache and deploy site.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Helper to test all tables and log detailed diagnostics
export const testSupabaseTables = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      message: 'Supabase URL or Key not detected in current web build.'
    };
  }

  const tables = ['site_content', 'slot_bookings', 'bands', 'band_members', 'profiles', 'instruments', 'instrument_requests'];
  const results = {};

  for (const table of tables) {
    try {
      const { data, count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(1);

      if (error) {
        results[table] = { ok: false, error: error.message };
      } else {
        results[table] = { ok: true, rows: count !== null ? count : (data ? data.length : 0) };
      }
    } catch (e) {
      results[table] = { ok: false, error: e.message };
    }
  }

  console.table(results);
  return {
    configured: true,
    url: supabaseUrl,
    results
  };
};
