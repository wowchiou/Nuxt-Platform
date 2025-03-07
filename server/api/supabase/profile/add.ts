import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;

  return await supabase.from('profiles').insert([body]);
});
