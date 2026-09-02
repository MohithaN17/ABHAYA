import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fpihkbwepvlsisdpdlyg.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWhrYndlcHZsc2lzZHBkbHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjM0MDMsImV4cCI6MjEwMzg5OTQwM30.hRrl-niBluEoJwyZbVhSdabqWyGuMJ4jpN8jcAlnGrE';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
