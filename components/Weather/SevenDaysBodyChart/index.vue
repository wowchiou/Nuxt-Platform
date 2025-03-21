<script setup lang="ts">
import * as echarts from 'echarts';
import moment from 'moment';
import { ElementName } from '~/types/weather';

const {
  chartColor,
  grid,
  splitLineStyle,
  axisLineStyle,
  legendStyle,
  axisPointerLineStyle,
  axisPointerLabelStyle,
  seriesLabelStyle,
  showDayOrNightAxis,
  dividerWeatherDay,
  getWeatherDateData,
} = useChart();

const weatherStore = useWeatherStore();
const { cityName, get7DaysElement } = storeToRefs(weatherStore);
const chartRef = ref<HTMLElement | null>(null);
const chart = ref<echarts.ECharts>();

const maxT = computed(() => {
  return get7DaysElement
    .value(ElementName['最高體感溫度'])
    .reduce((acc, itm) => {
      const t = Number(itm.ElementValue[0].MaxApparentTemperature);
      return acc < t ? t : acc;
    }, -999);
});

const minT = computed(() => {
  return get7DaysElement
    .value(ElementName['最低體感溫度'])
    .reduce((acc, itm) => {
      const t = Number(itm.ElementValue[0].MinApparentTemperature);
      return acc > t ? t : acc;
    }, 999);
});

const { execute } = useAsyncData(
  'get-7-days-weather',
  weatherStore.fetch7DaysWeather,
  { immediate: false }
);

onMounted(async () => {
  await execute();
  initChart();
  window.addEventListener('resize', resizeChart);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  if (chart.value) chart.value.dispose();
});

watch(cityName, initChart);

function initChart() {
  if (!chartRef.value) return;
  chart.value = echarts.init(chartRef.value, null, {
    renderer: 'canvas',
    width: chartRef.value?.clientWidth,
    height: 400,
    devicePixelRatio: window.devicePixelRatio || 2,
  });
  chart.value.setOption(getOption());
}

function resizeChart() {
  if (!chart.value) return;
  chart.value.dispose();
  initChart();
}

function getOption() {
  return {
    legend: legendStyle(),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: axisPointerLineStyle(),
        label: {
          ...axisPointerLabelStyle(),
          formatter: function (params: { value: string }) {
            return moment(params.value, 'YYYY/MM/DD/HH').format('MM/DD/HH');
          },
        },
      },
    },
    grid: grid(),
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLine: {
        // 軸線樣式
        show: true,
        lineStyle: axisLineStyle(),
      },
      axisTick: {
        // 刻度線
        show: true,
        length: 15, // 刻度長度
        lineStyle: axisLineStyle(),
      },
      data: getWeatherDateData(ElementName['最高溫度']),
      axisLabel: {
        formatter: function (value: string) {
          // 白天和晚上分開顯示
          return showDayOrNightAxis(value);
        },
      },
      splitLine: {
        show: true,
        interval: function (index: number, value: string) {
          // 每隔一天顯示分隔線
          return dividerWeatherDay(value);
        },
        lineStyle: splitLineStyle(),
      },
    },
    yAxis: {
      type: 'value',
      min: minT.value - 5,
      max: maxT.value + 5,
      splitLine: { show: false },
      axisLabel: { show: false },
    },
    series: [
      {
        name: `體感高溫°C`,
        type: 'line',
        color: chartColor['orange'],
        data: get7DaysElement.value(ElementName['最高體感溫度']).map((itm) => {
          return itm.ElementValue[0].MaxApparentTemperature;
        }),
        label: seriesLabelStyle(),
      },
      {
        name: `體感低溫°C`,
        type: 'line',
        color: chartColor['blue'],
        data: get7DaysElement
          .value(ElementName['最低體感溫度'])
          .map((itm) => itm.ElementValue[0].MinApparentTemperature),
        label: seriesLabelStyle({ position: 'bottom' }),
      },
    ],
  };
}
</script>

<template>
  <canvas ref="chartRef" />
</template>

<style scoped></style>
