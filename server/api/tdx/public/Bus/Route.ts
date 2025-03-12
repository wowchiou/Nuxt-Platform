import { tdxAPI } from '~/server/utils/tdx';
import cors from '~/server/api/tdx/public/cors';

export default defineEventHandler(async (event) => {
  cors(event);

  const query = getQuery(event);
  if (!query.city)
    return createError({ status: 400, message: 'city is required' });

  const $tdxAPI = await tdxAPI();
  const res = await $tdxAPI(`/v2/Bus/Route/City/${query.city}`);
  return res;
});
