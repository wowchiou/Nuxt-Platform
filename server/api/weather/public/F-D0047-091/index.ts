import { weatherAPI } from '~/server/utils/weather';
import cors from '~/server/api/tdx/public/cors';

export default defineEventHandler(async (event) => {
  cors(event);

  const config = useRuntimeConfig();
  const { weatherAuth } = config;

  const $api = await weatherAPI();
  const res = await $api(
    `/v1/rest/datastore/F-D0047-091?Authorization=${weatherAuth}`
  );
  return res;
});
