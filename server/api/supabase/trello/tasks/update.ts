import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;
  const { id, taskData } = body;

  const res = await supabase.from('trello_tasks').update(taskData).eq('id', id);

  return res;
});
