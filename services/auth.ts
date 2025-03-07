import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Tables } from '~/database/types';
import type { ProfileForm } from '~/types/auth';

import { supabase } from '~/utils/supabase';
import { errorHandler, toastHandler } from './error';

type SignForm = {
  email: string;
  password: string;
};

// const { $fetch, supabase } = useNuxtApp();

export async function sbSignup({ email, password }: SignForm) {
  const res = await supabase.auth.signUp({ email, password });
  if (res.error) toastHandler(res);
  return res;
}

export async function sbSignin({ email, password }: SignForm) {
  const res = await supabase.auth.signInWithPassword({ email, password });
  if (res.error) toastHandler(res);
  return res;
}

export async function sbSignout() {
  const res = await supabase.auth.signOut();
  if (res.error) toastHandler(res);
  return res;
}

export async function sbGetSession() {
  const res = await supabase.auth.getSession();
  if (res.error) toastHandler(res);
  return res;
}

export async function sbGetProfile(id: string) {
  const res: PostgrestSingleResponse<Tables<'profiles'>> = await $fetch(
    `/api/supabase/profile?id=${id}`
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbSetProfile(profile: ProfileForm) {
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/profile/add',
    {
      method: 'POST',
      body: profile,
    }
  );
  if (res.error) errorHandler(res);
  return res;
}

export async function sbUpdateProfile(profile: ProfileForm) {
  const res: PostgrestSingleResponse<null> = await $fetch(
    '/api/supabase/profile/update',
    {
      method: 'POST',
      body: profile,
    }
  );
  if (res.error) errorHandler(res);
  return res;
}
