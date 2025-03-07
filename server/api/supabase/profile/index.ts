import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.id) return;

  return await supabase.from('profiles').select().eq('id', query.id).single();
});
