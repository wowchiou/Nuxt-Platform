import type { PostgrestError } from '@supabase/supabase-js';

interface CustomError extends Error {
  customCode?: number;
}

interface ExtendPostgrestError extends PostgrestError {
  statusCode?: number;
}

interface ErrorParams {
  error: string | PostgrestError | Error;
  customCode?: number;
}

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<CustomError | ExtendPostgrestError | null>(null);
  const isCustomError = ref(false);

  function setError({ error, customCode }: ErrorParams) {
    console.log(error);

    const isStringError = typeof error === 'string';
    if (isStringError) isCustomError.value = true;

    // 如果 error 是字串或 Error 實例，則轉換成 Error 實例
    if (isStringError || error instanceof Error) {
      activeError.value = isStringError ? Error(error) : error;
      activeError.value.customCode = customCode;
      return;
    }

    // 如果 error 是 PostgrestError 實例，則加入 statusCode
    activeError.value = error;
    activeError.value.statusCode = customCode;
  }

  function clearError() {
    activeError.value = null;
    isCustomError.value = false;
  }

  return { activeError, setError, clearError, isCustomError };
});
