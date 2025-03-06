export default defineNuxtPlugin((nuxtApp) => {
  console.log('🚀 開始設定 $fetch');

  // 創建一個新的 $fetch 實例，並設定其基本配置
  const fetchInstance = $fetch.create({
    baseURL: '/api', // 設定 API 的基本 URL
    headers: {
      'Content-Type': 'application/json', // 設定預設的請求標頭
    },
    onRequest({ request, options }) {
      // 在發送請求之前的攔截器
      // console.log('🚀 發送請求: ', request);
      // console.log('🚀 發送選項: ', options);
    },
    onResponse({ response }) {
      // 在收到回應之後的攔截器
      // console.log('✅ 收到回應: ', response);
      return response._data; // 返回回應的數據
    },
    async onResponseError({ response }) {
      // 在回應錯誤時的攔截器
      // console.error('❌ 錯誤回應: ', request, response, error);

      if (response.status === 401) {
        // 如果回應狀態碼是 401（未授權）
        await nuxtApp.runWithContext(() => navigateTo('/login')); // 導航到登入頁面
      }
    },
  });

  // 設定全域變數，讓其他地方可以使用
  nuxtApp.provide('api', fetchInstance);
});

declare module '#app' {
  interface NuxtApp {
    $api: typeof $fetch; // 擴展 NuxtApp 介面，加入 $apiFetch 屬性
  }
}
