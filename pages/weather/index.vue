<script setup lang="ts">
import { ElementName } from '~/types/weather';

const route = useRoute();
const router = useRouter();
const weatherStore = useWeatherStore();
const { cityName, getHoursElement, weatherHours, weather7Days } =
  storeToRefs(weatherStore);

const { execute: get7DaysWeather } = useAsyncData(
  'get-7-days-weather',
  weatherStore.fetch7DaysWeather,
  { immediate: false }
);

const { execute: getHoursWeather } = useAsyncData(
  'get-7-days-rain',
  weatherStore.fetchHoursWeather,
  { immediate: false }
);

const isFetching = computed(() => !weatherHours.value || !weather7Days.value);

watch(cityName, (val) => {
  setCityNameOfRoute(val);
});

onMounted(async () => {
  await Promise.all([get7DaysWeather(), getHoursWeather()]);

  const cityNameOfRoute = route.query.cityName as string;
  if (cityNameOfRoute) weatherStore.setCityName(cityNameOfRoute);
  if (cityName.value) setCityNameOfRoute(cityName.value);
});

function setCityNameOfRoute(name: string) {
  router.push({ query: { cityName: name } });
}
</script>

<template>
  <div class="relative flex-1 w-full rounded">
    <AppLoading v-if="isFetching" />

    <div v-else class="relative w-full text-[14px] bg-white p-5">
      <div class="w-full sticky top-[56px] bg-white z-10 py-5 -mt-5">
        <div class="flex items-center">
          <div class="title font-bold">{{ cityName }}</div>
          <WeatherInfoCard class="ml-5" />
        </div>
        <WeatherCitySelector class="mt-5" />
      </div>

      <div class="bg-slate-200 rounded p-5">
        {{
          getHoursElement(ElementName['天氣預報綜合描述'])[0].ElementValue[0]
            .WeatherDescription
        }}
      </div>

      <WeatherHoursDetail class="mt-5" />

      <div class="mt-5">
        <div>
          <div class="title">一週天氣溫度</div>
          <el-divider class="!my-2" />
          <WeatherSevenDaysChart class="w-full" />
        </div>

        <div class="mt-5">
          <div class="title">未來降雨曲線</div>
          <el-divider class="!my-2" />
          <WeatherSevenDaysRainChart class="w-full" />
        </div>

        <div class="mt-5">
          <div class="title">一週體感溫度</div>
          <el-divider class="!my-2" />
          <WeatherSevenDaysBodyChart class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  @apply text-[16px];
}
</style>
