import type { AuthError, PostgrestError } from '@supabase/supabase-js';

export interface CustomError extends Error {
  customCode?: number;
  statusCode?: number;
}

export interface ExtendPostgrestError extends PostgrestError {
  statusCode?: number;
}

export interface ErrorParams {
  error: string | PostgrestError | AuthError;
  customCode?: number;
}
