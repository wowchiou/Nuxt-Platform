import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;
  const { list } = body;

  const res = await supabase.from('trello_lists').insert(list).select('*');

  return res;
});
