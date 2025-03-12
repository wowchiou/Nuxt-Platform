import { TdxToken, TdxTokenResponse } from '~/types/tdx';

// 擴展 globalThis 型別
declare global {
  var tdxToken: TdxToken | undefined | null;
}

export async function getTdxToken() {
  const tdxToken = globalThis.tdxToken;

  const now = Date.now();

  // 如果 Token 還沒過期，直接返回
  if (tdxToken?.access_token && now < tdxToken.token_fetched_at) {
    console.log('server/utils/tdx', '使用舊的 TDX Token');
    return tdxToken;
  }

  console.log('server/utils/tdx', '獲取新的 TDX Token');
  const config = useRuntimeConfig();
  const parameter = {
    grant_type: 'client_credentials',
    client_id: config.tdxID,
    client_secret: config.tdxKey,
  };
  const AUTH_URL =
    'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';

  // 請求新的 Token
  try {
    const response = await $fetch<TdxTokenResponse>(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(parameter),
    });

    // 儲存 Token 和過期時間
    if (!response) return false;
    globalThis.tdxToken = response as TdxToken;
    globalThis.tdxToken.token_fetched_at = now + response.expires_in * 1000;
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function tdxAPI() {
  // 創建一個新的 $fetch 實例，並設定其基本配置
  const fetchInstance = $fetch.create({
    baseURL: 'https://tdx.transportdata.tw/api/basic',
    headers: {
      'Content-Type': 'application/json',
    },
    async onRequest({ request, options }) {
      // 在發送請求之前的攔截器
      const token = await getTdxToken(); // 獲取 TDX Token
      if (!token) return;
      options.headers.set('Authorization', `Bearer ${token.access_token}`);
    },
    onResponse({ response }) {
      // 在收到回應之後的攔截器
      return response._data; // 返回回應的數據
    },
  });

  return fetchInstance;
}
