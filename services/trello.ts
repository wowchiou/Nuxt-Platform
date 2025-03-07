import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Tables } from '~/database/types';
import type {
  TrelloListsOrders,
  TrelloProjects,
  TrelloProjectsAddData,
} from '~/types/trello';
import { errorHandler } from './error';

// const { $fetch } = useNuxtApp();
const { user } = storeToRefs(useAuthStore());

export async function sbGetTrelloProjects() {
  if (!user.value) return;
  const res: PostgrestSingleResponse<TrelloProjects[]> = await $fetch(
    `/api/supabase/trello/projects?id=${user.value.id}`
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbSetTrelloProjects(name: string) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<Tables<'trello_projects'>[]> =
    await $fetch('/api/supabase/trello/projects/add', {
      method: 'POST',
      body: { name, id: user.value.id },
    });
  if (res.error) errorHandler(res);
  return res;
}

export async function sbUpdateTrelloProjects(
  id: string,
  listData: { name: string }
) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/trello/projects/update',
    {
      method: 'POST',
      body: { listData, id },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbAddTrelloLists(list: TrelloProjectsAddData[]) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<Tables<'trello_lists'>[]> = await $fetch(
    '/api/supabase/trello/lists/add',
    {
      method: 'POST',
      body: { list },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbUpdateTrelloLists(
  id: string,
  listData: { name: string }
) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/trello/lists/update',
    {
      method: 'POST',
      body: { listData, id },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbAddTrelloTasks({
  name,
  listID,
  order,
}: {
  name: string;
  listID: string;
  order: number;
}) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<Tables<'trello_tasks'>[]> = await $fetch(
    '/api/supabase/trello/tasks/add',
    {
      method: 'POST',
      body: { name, listID, order },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbUpdateTrelloTasks(
  id: string,
  taskData: { name: string }
) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<Tables<'trello_tasks'>[]> = await $fetch(
    '/api/supabase/trello/tasks/update',
    {
      method: 'POST',
      body: { taskData, id },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbSetTrelloListsOrder(lists: TrelloListsOrders[]) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/trello/lists/order',
    {
      method: 'POST',
      body: { lists },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbSetTrelloTasksOrder(
  lists: Required<Tables<'trello_tasks'>>[]
) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/trello/tasks/order',
    {
      method: 'POST',
      body: { lists },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbDeleteTrelloTasks(id: string) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/trello/tasks/delete',
    {
      method: 'POST',
      body: { id },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbDeleteTrelloLists(id: string) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/trello/lists/delete',
    {
      method: 'POST',
      body: { id },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbDeleteTrelloProjects(id: string) {
  if (!user.value) return;
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/trello/projects/delete',
    {
      method: 'POST',
      body: { id },
    }
  );
  if (res.error) errorHandler(res);
  return res;
}
