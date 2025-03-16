import { weatherAPI } from '~/server/utils/weather';
import { WeatherError } from '~/types/weather';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { weatherAuth } = config;
  const $api = await weatherAPI();

  try {
    const res = await $api(
      `/v1/rest/datastore/F-D0047-091?Authorization=${weatherAuth}`
    );
    return res;
  } catch (error) {
    const { statusCode, statusMessage } = error as WeatherError;
    throw createError({ statusCode, statusMessage });
  }
});
