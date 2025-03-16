<script setup lang="ts">
import * as echarts from 'echarts';
import { ElementName } from '~/types/weather';
import moment from 'moment';

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
} = useChart();

const weatherStore = useWeatherStore();
const { cityName, get7DaysElement } = storeToRefs(weatherStore);
const chartRef = ref<HTMLElement | null>(null);
const chart = ref();

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
      data: get7DaysElement
        .value(ElementName['The12小時降雨機率'])
        .reduce((acc, itm) => {
          if (itm.ElementValue[0].ProbabilityOfPrecipitation === '-')
            return acc;

          const start = moment(itm.StartTime).format('YYYY/MM/DD/HH');
          const end = moment(itm.EndTime).format('YYYY/MM/DD/HH');
          if (!acc.includes(start)) acc.push(start);
          if (!acc.includes(end)) acc.push(end);

          return acc;
        }, [] as string[]),
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
      min: 0,
      max: 110,
      splitLine: { show: false },
      axisLabel: { show: false },
    },
    series: [
      {
        name: `降雨機率%`,
        type: 'line',
        smooth: true,
        color: chartColor['blue'],
        data: get7DaysElement
          .value(ElementName['The12小時降雨機率'])
          .map((itm) => itm.ElementValue[0].ProbabilityOfPrecipitation),
        label: seriesLabelStyle(),
      },
    ],
  };
}
</script>

<template>
  <canvas ref="chartRef" />
</template>

<style scoped></style>
