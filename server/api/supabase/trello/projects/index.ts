import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.id) return;

  return await supabase
    .from('trello_projects')
    .select(
      'id, name, created_at, user_id, trello_lists(id, name, order, created_at, trello_tasks(id, name, order, list_id, created_at))'
    )
    .eq('user_id', query.id);
});
