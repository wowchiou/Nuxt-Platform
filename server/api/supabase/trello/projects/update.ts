import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;
  const { listData, id } = body;

  const res = await supabase
    .from('trello_projects')
    .update(listData)
    .eq('id', id);
  return res;
});
