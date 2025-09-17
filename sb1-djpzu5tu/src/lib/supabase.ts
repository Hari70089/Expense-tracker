import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

// Note: Replace with your actual Supabase credentials
const isConfigured = supabaseUrl !== 'https://your-project-id.supabase.co' && 
                    supabaseAnonKey !== 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { isConfigured };