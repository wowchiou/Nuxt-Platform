import { createClient } from '@supabase/supabase-js';
import type { Database } from '~/database/types';

const config = useRuntimeConfig();

export const supabase = createClient<Database>(
  config.public.supabaseUrl,
  config.public.supabaseKey
);
