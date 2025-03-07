import type { AuthError, PostgrestError } from '@supabase/supabase-js';

type ErrorHandlerParams = {
  error: PostgrestError | null;
  status: number;
};

const errorStore = useErrorStore();

export function errorHandler({ error, status }: ErrorHandlerParams) {
  errorStore.setError({ error: error!, customCode: status ?? 500 });
}

export function toastHandler({ error }: { error: AuthError | null }) {
  console.log(error);
  if (!error) return;
  const message =
    error.message === 'Invalid login credentials'
      ? '帳號或密碼錯誤'
      : error.message;
  ElNotification.error({ message });
}
