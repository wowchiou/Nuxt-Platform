import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import type { Tables } from '~/database/types';
import type { ProfileForm } from '~/types/auth';
import type { TrelloListsOrders, TrelloProjectsAddData } from '~/types/trello';

type SignForm = {
  email: string;
  password: string;
};

type ErrorHandlerParams = {
  error: PostgrestError | null;
  status: number;
};

export const useSupabase = () => {
  const { $supabase } = useNuxtApp();
  const { setError } = useErrorStore();
  const { user } = storeToRefs(useAuthStore());

  function errorHandler({ error, status }: ErrorHandlerParams) {
    setError({ error: error!, customCode: status ?? 500 });
  }

  function toastHandler({ error }: { error: AuthError | null }) {
    console.log(error);
    if (!error) return;
    const message =
      error.message === 'Invalid login credentials'
        ? '帳號或密碼錯誤'
        : error.message;
    ElNotification.error({ message });
  }

  async function sbSignup({ email, password }: SignForm) {
    const res = await $supabase.auth.signUp({ email, password });
    if (res.error) toastHandler(res);
    return res;
  }

  async function sbSignin({ email, password }: SignForm) {
    const res = await $supabase.auth.signInWithPassword({ email, password });
    if (res.error) toastHandler(res);
    return res;
  }

  async function sbSignout() {
    const res = await $supabase.auth.signOut();
    if (res.error) toastHandler(res);
    return res;
  }

  async function sbGetSession() {
    const res = await $supabase.auth.getSession();
    if (res.error) toastHandler(res);
    return res;
  }

  async function sbGetProfile(id: string) {
    const res = await $supabase.from('profiles').select().eq('id', id).single();
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbSetProfile(profile: ProfileForm) {
    const res = await $supabase.from('profiles').insert(profile);
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbGetTrelloProjects() {
    if (!user.value) return;
    const res = await $supabase
      .from('trello_projects')
      .select(
        'id, name, created_at, user_id, trello_lists(id, name, order, created_at, trello_tasks(id, name, order, list_id, created_at))'
      )
      .eq('user_id', user.value.id);
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbSetTrelloProjects(name: string) {
    if (!user.value) return;
    const res = await $supabase
      .from('trello_projects')
      .insert([{ name, user_id: user.value.id }])
      .select('*');
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbAddTrelloLists(list: TrelloProjectsAddData[]) {
    if (!user.value) return;
    const res = await $supabase.from('trello_lists').insert(list).select('*');
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbAddTrelloTasks({
    name,
    listID,
    order,
  }: {
    name: string;
    listID: string;
    order: number;
  }) {
    if (!user.value) return;
    const res = await $supabase
      .from('trello_tasks')
      .insert([{ name, order, list_id: listID }])
      .select('*');
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbSetTrelloListsOrder(lists: TrelloListsOrders[]) {
    if (!user.value) return;
    const res = await $supabase.from('trello_lists').upsert(lists);
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbSetTrelloTasksOrder(
    lists: Required<Tables<'trello_tasks'>>[]
  ) {
    if (!user.value) return;
    const res = await $supabase.from('trello_tasks').upsert(lists);
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbDeleteByID(table: string, id: string) {
    if (!user.value) return;
    const res = await $supabase.from(table).delete().eq('id', id);
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbUpdateTrelloTasks(id: string, taskData: { name: string }) {
    if (!user.value) return;
    const res = await $supabase
      .from('trello_tasks')
      .update(taskData)
      .eq('id', id);
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbUpdateTrelloLists(id: string, listData: { name: string }) {
    if (!user.value) return;
    const res = await $supabase
      .from('trello_lists')
      .update(listData)
      .eq('id', id);
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbUpdateTrelloProjects(
    id: string,
    listData: { name: string }
  ) {
    if (!user.value) return;
    const res = await $supabase
      .from('trello_projects')
      .update(listData)
      .eq('id', id);
    if (res.error) errorHandler(res);
    return res;
  }

  return {
    sbSignup,
    sbSignin,
    sbSignout,
    sbGetSession,
    sbGetProfile,
    sbSetProfile,
    sbGetTrelloProjects,
    sbSetTrelloProjects,
    sbAddTrelloLists,
    sbAddTrelloTasks,
    sbSetTrelloListsOrder,
    sbSetTrelloTasksOrder,
    sbDeleteByID,
    sbUpdateTrelloTasks,
    sbUpdateTrelloLists,
    sbUpdateTrelloProjects,
  };
};
