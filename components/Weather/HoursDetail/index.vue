<script setup lang="ts">
import type { ScrollbarInstance } from 'element-plus';
import moment from 'moment';
import { ElementName } from '~/types/weather';

type WeatherData = {
  date: string;
  time: string;
  value: string;
  isNight: boolean;
  weatherCode: string;
};

const weatherStore = useWeatherStore();
const { getHoursElement, cityName, weatherHours } = storeToRefs(weatherStore);
const scrollbarRef = ref<ScrollbarInstance | null>(null);

const { execute } = useAsyncData(
  'get-hours-weather',
  weatherStore.fetchHoursWeather,
  { immediate: false }
);

const temperatureData = computed(() => {
  return getHoursElement
    .value(ElementName['溫度'])
    .reduce((acc, item, index) => {
      // 天氣現象的資料可能會比溫度少，所以要確認有沒有資料，沒有就跳過
      const codeData = getHoursElement.value(ElementName['天氣現象'])[index];
      if (!codeData) return acc;

      acc.push({
        date: moment(item.DataTime).format('M/DD'),
        time: formatTime(item.DataTime || ''),
        value: item.ElementValue[0].Temperature as string,
        isNight: getTimeText(moment(item.DataTime).hour()).isNight,
        weatherCode: getHoursElement.value(ElementName['天氣現象'])[index]
          .ElementValue[0].WeatherCode as string,
      });

      return acc;
    }, [] as WeatherData[]);
});

watch(cityName, () => {
  scrollToLeft();
});

onMounted(async () => {
  await execute();
});

function formatTime(time: Date | string) {
  if (!time) return '';
  const h = moment(time).hour();
  let text = getTimeText(h).text;
  return `${text} ${h}時`;
}

function getTimeText(hour: number) {
  if (!hour && !String(hour)) return { text: '', isNight: false };
  if (hour >= 5 && hour < 12) {
    return { text: '早上', isNight: false };
  } else if (hour === 12) {
    return { text: '中午', isNight: false };
  } else if (hour >= 13 && hour < 18) {
    return { text: '下午', isNight: false };
  } else if (hour >= 18 && hour < 24) {
    return { text: '晚上', isNight: true };
  } else {
    return { text: '凌晨', isNight: true }; // 0~4點
  }
}

function scrollToLeft() {
  nextTick(() => scrollbarRef.value?.scrollTo({ left: 0 }));
}
</script>

<template>
  <el-scrollbar
    v-if="weatherHours"
    ref="scrollbarRef"
    class="bg-slate-200 rounded"
  >
    <div
      class="flex items-start gap-x-7 whitespace-nowrap text-center px-5 pt-8 pb-3"
    >
      <div
        class="relative"
        v-for="(itm, idx) in temperatureData"
        :key="`t-data-4{idx}`"
      >
        <div
          class="absolute top-0 left-0 -translate-y-[110%] w-full text-center border-b-[1px] border-white pb-[2px]"
          v-if="idx === 0 || itm.date !== temperatureData[idx - 1].date"
        >
          {{ itm.date }}
        </div>
        <div>{{ itm.time }}</div>
        <div class="flex justify-center mt-2">
          <img
            class="w-[30px] h-[30px]"
            :src="
              weatherStore.getWeatherPic(
                itm.isNight ? 'night' : 'day',
                itm.weatherCode
              )
            "
            alt=""
          />
        </div>
        <div class="mt-2">{{ itm.value }}°C</div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped></style>
