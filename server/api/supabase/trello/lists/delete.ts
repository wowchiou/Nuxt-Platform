import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;
  const { id } = body;

  const res = await supabase.from('trello_lists').delete().eq('id', id);

  return res;
});
