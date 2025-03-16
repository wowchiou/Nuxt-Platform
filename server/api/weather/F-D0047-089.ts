import { weatherAPI } from '~/server/utils/weather';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { weatherAuth } = config;

  const $api = await weatherAPI();
  const res = await $api(
    `/v1/rest/datastore/F-D0047-089?Authorization=${weatherAuth}`
  );
  return res;
});
