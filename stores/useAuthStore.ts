import type { User } from '@supabase/supabase-js';
import type { Tables } from '~/database/types';
import type { ProfileForm, Signin, Signup } from '~/types/auth';

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<User | null>(null);
  const profile = ref<Tables<'profiles'> | null>(null);
  const userPosition = ref<number[] | null>(null);
  const defaultPosition = ref([25.0329694, 121.5654177]);
  const isAuthTracking = ref(false);
  const loadingProfile = ref(false);

  const {
    sbGetProfile,
    sbGetSession,
    sbAddProfile,
    sbUpdateProfile,
    sbSignin,
    sbSignout,
    sbSignup,
  } = useSupabase();

  function setUserPosition(position: number[]) {
    userPosition.value = position;
  }

  // supabase 自身提供的監聽登入狀態，以此監聽統一設定登出、登入 auth 資訊
  async function trackAuthState() {
    if (isAuthTracking.value) return;
    isAuthTracking.value = true;

    useNuxtApp().$supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        await setAuth(session?.user ?? null);
      }, 0);
    });
  }

  // 註冊
  async function signup(form: Signup) {
    const { data } = await sbSignup(form);
    if (data && data.user) {
      await setProfile({
        id: data.user.id,
        username: form.username,
        full_name: form.username,
      });
      return data;
    }
    return false;
  }

  // 登入
  async function signin(form: Signin) {
    const { data } = await sbSignin(form);
    if (data && data.user) {
      return data;
    }
    return false;
  }

  // 登出
  async function signout() {
    const { error } = await sbSignout();
    if (error) return false;
    return true;
  }

  // 獲取profile
  async function getProfile(id: string) {
    if (profile.value && profile.value.id === user.value?.id) return;
    if (!id) return;
    loadingProfile.value = true;
    const { data } = await sbGetProfile(id);
    loadingProfile.value = false;
    if (data) {
      profile.value = data;
      return data;
    }
  }

  // 新增profile
  async function setProfile(form: ProfileForm) {
    const { error } = await sbAddProfile(form);
    if (error) return false;
    return true;
  }

  // 更新profile
  async function updateProfile(form: ProfileForm) {
    const { data, error } = await sbUpdateProfile({
      ...form,
      id: user.value!.id,
      full_name: form.username,
    });
    if (error) return false;
    if (data) profile.value = data[0];
    return true;
  }

  // 獲取登入 session 資訊
  async function getSession() {
    const { data } = await sbGetSession();
    if (data.session) return data;
  }

  async function setAuth(auth: User | null) {
    if (!auth) {
      user.value = null;
      profile.value = null;
      return;
    }
    user.value = auth;
    if (loadingProfile.value) return;
    await getProfile(user.value.id);
  }

  return {
    user,
    profile,
    userPosition,
    defaultPosition,
    setUserPosition,
    trackAuthState,
    signup,
    signin,
    signout,
    getSession,
    setAuth,
    setProfile,
    updateProfile,
  };
});
