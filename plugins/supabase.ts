import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/database/types';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );

  // 設定全域變數，讓其他地方可以使用
  nuxtApp.provide('supabase', supabase);
});

declare module '#app' {
  interface NuxtApp {
    $supabase: SupabaseClient;
  }
}
