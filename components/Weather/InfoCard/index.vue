<script setup lang="ts">
import moment from 'moment';
import { ElementName } from '~/types/weather';

const weatherStore = useWeatherStore();
const { getHoursElement } = storeToRefs(weatherStore);

const { execute } = useAsyncData(
  'get-hours-weather',
  weatherStore.fetchHoursWeather,
  { immediate: false }
);

const weatherPicture = computed(() => {
  const w = getHoursElement.value(ElementName['天氣現象']);
  const time = moment(w[0].StartTime).format('HH');
  const dayOrNight = ['06', '18'].includes(time) ? 'day' : 'night';
  const weatherCode = w[0].ElementValue[0].WeatherCode;
  return weatherStore.getWeatherPic(dayOrNight, weatherCode);
});

onMounted(async () => {
  await execute();
});
</script>

<template>
  <div class="text-gray-500 flex items-center gap-x-5">
    <div class="flex justify-center">
      <img class="w-[35px]" :src="weatherPicture" alt="" />
    </div>
    <div class="font-bold">
      <span class="text-[20px]">
        {{
          getHoursElement(ElementName['溫度'])[0].ElementValue[0].Temperature
        }}
      </span>
      <span class="text-[12px]">°C</span>
    </div>
    <div class="flex items-center justify-center gap-x-2">
      降雨率
      {{
        getHoursElement(ElementName['The3小時降雨機率'])[0].ElementValue[0]
          .ProbabilityOfPrecipitation
      }}%
    </div>
    <div class="flex items-center justify-center">
      體感
      {{
        getHoursElement(ElementName['體感溫度'])[0].ElementValue[0]
          .ApparentTemperature
      }}
      <span>°C</span>
    </div>
  </div>
</template>

<style scoped></style>
