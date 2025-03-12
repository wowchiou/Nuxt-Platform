import { tdxAPI } from '~/server/utils/tdx';
import cors from '~/server/api/tdx/public/cors';

export default defineEventHandler(async (event) => {
  cors(event);

  const $tdxAPI = await tdxAPI();
  const res = await $tdxAPI('/v2/Tourism/Hotel');
  return res;
});
