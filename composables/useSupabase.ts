import type { Tables } from '~/database/types';
import type { ProfileForm } from '~/types/auth';
import type {
  AuthError,
  PostgrestError,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';
import type {
  TrelloListsOrders,
  TrelloProjects,
  TrelloProjectsAddData,
} from '~/types/trello';

type SignForm = {
  email: string;
  password: string;
};

type ErrorHandlerParams = {
  error: PostgrestError | null;
  status: number;
};

export const useSupabase = () => {
  const { $api, $supabase } = useNuxtApp();
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
    const res: PostgrestSingleResponse<Tables<'profiles'>> = await $api(
      `/api/supabase/profile?id=${id}`
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbAddProfile(profile: ProfileForm) {
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/profile/add',
      {
        method: 'POST',
        body: profile,
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbUpdateProfile(profile: ProfileForm) {
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/profile/update',
      {
        method: 'POST',
        body: profile,
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbGetTrelloProjects() {
    if (!user.value) return;
    const res: PostgrestSingleResponse<TrelloProjects[]> = await $api(
      `/api/supabase/trello/projects?id=${user.value.id}`
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbSetTrelloProjects(name: string) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<Tables<'trello_projects'>[]> =
      await $api('/api/supabase/trello/projects/add', {
        method: 'POST',
        body: { name, id: user.value.id },
      });
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbUpdateTrelloProjects(
    id: string,
    listData: { name: string }
  ) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/trello/projects/update',
      {
        method: 'POST',
        body: { listData, id },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbAddTrelloLists(list: TrelloProjectsAddData[]) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<Tables<'trello_lists'>[]> = await $api(
      '/api/supabase/trello/lists/add',
      {
        method: 'POST',
        body: { list },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbUpdateTrelloLists(id: string, listData: { name: string }) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/trello/lists/update',
      {
        method: 'POST',
        body: { listData, id },
      }
    );
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
    const res: PostgrestSingleResponse<Tables<'trello_tasks'>[]> = await $api(
      '/api/supabase/trello/tasks/add',
      {
        method: 'POST',
        body: { name, listID, order },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbUpdateTrelloTasks(id: string, taskData: { name: string }) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<Tables<'trello_tasks'>[]> = await $api(
      '/api/supabase/trello/tasks/update',
      {
        method: 'POST',
        body: { taskData, id },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbSetTrelloListsOrder(lists: TrelloListsOrders[]) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/trello/lists/order',
      {
        method: 'POST',
        body: { lists },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbSetTrelloTasksOrder(
    lists: Required<Tables<'trello_tasks'>>[]
  ) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/trello/tasks/order',
      {
        method: 'POST',
        body: { lists },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbDeleteTrelloTasks(id: string) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/trello/tasks/delete',
      {
        method: 'POST',
        body: { id },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbDeleteTrelloLists(id: string) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/trello/lists/delete',
      {
        method: 'POST',
        body: { id },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbDeleteTrelloProjects(id: string) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/trello/projects/delete',
      {
        method: 'POST',
        body: { id },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbGetBikeFavorite() {
    if (!user.value) return;
    const res: PostgrestSingleResponse<Tables<'bike_favorite'>[]> = await $api(
      `/api/supabase/bike/favorite?id=${user.value.id}`
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbAddBikeFavorite(stationID: string) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<Tables<'bike_favorite'>[]> = await $api(
      '/api/supabase/bike/favorite/add',
      {
        method: 'POST',
        body: { stationID, userID: user.value.id },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  async function sbDeleteBikeFavorite(stationID: string) {
    if (!user.value) return;
    const res: PostgrestSingleResponse<null> = await $api(
      '/api/supabase/bike/favorite/delete',
      {
        method: 'POST',
        body: { userID: user.value.id, stationID },
      }
    );
    if (res.error) errorHandler(res);
    return res;
  }

  return {
    sbSignup,
    sbSignin,
    sbSignout,
    sbGetSession,
    sbGetProfile,
    sbAddProfile,
    sbUpdateProfile,
    sbGetTrelloProjects,
    sbSetTrelloProjects,
    sbAddTrelloLists,
    sbAddTrelloTasks,
    sbSetTrelloListsOrder,
    sbSetTrelloTasksOrder,
    sbUpdateTrelloTasks,
    sbUpdateTrelloLists,
    sbUpdateTrelloProjects,
    sbDeleteTrelloTasks,
    sbDeleteTrelloLists,
    sbDeleteTrelloProjects,
    sbGetBikeFavorite,
    sbAddBikeFavorite,
    sbDeleteBikeFavorite,
  };
};
