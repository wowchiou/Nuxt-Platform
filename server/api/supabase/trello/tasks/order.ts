import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;
  const { lists } = body;

  const res = await supabase.from('trello_tasks').upsert(lists);
  return res;
});
