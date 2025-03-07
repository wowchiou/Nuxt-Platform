import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;
  const { name, order, listID } = body;

  const res = await supabase
    .from('trello_tasks')
    .insert([{ name, order, list_id: listID }])
    .select('*');

  return res;
});
