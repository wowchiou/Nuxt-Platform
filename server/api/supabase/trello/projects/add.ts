import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;
  const { name, id } = body;

  const res = await supabase
    .from('trello_projects')
    .insert({ name: name, user_id: id })
    .select('*');

  return res;
});
