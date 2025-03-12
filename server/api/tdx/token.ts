import { getTdxToken } from '~/server/utils/tdx';
import { TdxToken } from '~/types/tdx';

// 擴展 globalThis 型別
declare global {
  var tdxToken: TdxToken | undefined | null;
}

export default defineEventHandler(async (event) => {
  const isDev = process.env.NODE_ENV === 'development';

  // 給其他網站使用的 API，需要設定 CORS
  // 設定cors
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': isDev ? '*' : 'https://wowchiou.github.io',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  // 透過 TDX API 取得 token
  try {
    const tdxToken = await getTdxToken();
    if (!tdxToken) {
      createError({ statusCode: 500, message: '取得 TDX Token 失敗' });
    }
    return tdxToken;
  } catch (error) {
    createError({ statusCode: 500, message: '取得 TDX Token 失敗' });
  }
});
