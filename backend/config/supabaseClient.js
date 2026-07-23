import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://gixqpvojsyitkbgctlqz.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client for standard authenticated operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client using service role key for privileged database queries
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

console.log('✅ Supabase Client Initialized for Project:', supabaseUrl);
