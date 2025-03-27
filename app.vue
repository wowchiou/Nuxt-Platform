<script setup lang="ts">
const route = useRoute();
const errorStore = useErrorStore();
const authStore = useAuthStore();

// 監聽登入狀態
authStore.trackAuthState();

const { status, execute, data } = useAsyncData(
  'auth-check',
  authStore.getSession,
  { immediate: false }
);

// 如果頁面執行有錯誤，則將錯誤訊息存入errorStore
onErrorCaptured((error) => {
  errorStore.setError({ error });
});

onBeforeMount(async () => {
  // 載入頁面檢查是否有登入
  await checkAuth();
});

async function checkAuth() {
  await execute();
  const isLogin = data.value && data.value.session.user;
  const blockList = ['/signin', '/signup'];
  const isBlockWhenLoggedIn = blockList.includes(route.path);

  // 如果需要登入但未登入
  // if (!isBlockWhenLoggedIn && !isLogin) {
  //   return navigateTo('/signin');
  // }
  // 如果已登入但試圖進入登入或註冊頁，導回首頁
  if (isBlockWhenLoggedIn && isLogin) {
    return navigateTo('/');
  }
}

useSeoMeta({
  title: 'AC Demo',
  description:
    '此網站為個人作品Demo，站內的所有資料皆為測試資料，請勿使用真實資料註冊且資料不定時會刪除更新。',
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <AppLoading class="!fixed w-screen h-screen" v-if="status === 'pending'" />

  <NuxtLayout v-else>
    <AppError v-if="errorStore.activeError" />
    <NuxtPage v-else />
  </NuxtLayout>
</template>

<style></style>
