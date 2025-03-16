<script setup lang="ts">
import * as echarts from 'echarts';
import { ElementName } from '~/types/weather';
import moment from 'moment';
import { formatter } from 'element-plus';

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
const chart = ref();

const maxT = computed(() => {
  return get7DaysElement.value(ElementName['最高溫度']).reduce((acc, itm) => {
    const t = Number(itm.ElementValue[0].MaxTemperature);
    return acc < t ? t : acc;
  }, -999);
});

const minT = computed(() => {
  return get7DaysElement.value(ElementName['最低溫度']).reduce((acc, itm) => {
    const t = Number(itm.ElementValue[0].MinTemperature);
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
  console.log(getOption());
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
        name: `高溫°C`,
        type: 'line',
        color: chartColor['orange'],
        data: get7DaysElement
          .value(ElementName['最高溫度'])
          .map((itm) => itm.ElementValue[0].MaxTemperature),
        label: seriesLabelStyle(),
        markPoint: {
          data: getTempMarkPoint(ElementName['最高溫度'], 'MaxTemperature', [
            '0%',
            '-170%',
          ]),
        },
      },
      {
        name: `低溫°C`,
        type: 'line',
        color: chartColor['blue'],
        data: get7DaysElement
          .value(ElementName['最低溫度'])
          .map((itm) => itm.ElementValue[0].MinTemperature),
        label: seriesLabelStyle({ position: 'bottom' }),
        markPoint: {
          data: getTempMarkPoint(ElementName['最低溫度'], 'MinTemperature', [
            '0%',
            '170%',
          ]),
        },
      },
    ],
  };
}

// 設定圖表上的溫度圖點位與圖片
function getTempMarkPoint(
  elementName: ElementName,
  dataName: 'MaxTemperature' | 'MinTemperature',
  offset: string[]
) {
  return get7DaysElement.value(elementName).map((itm, idx) => {
    const elementValue = itm.ElementValue[0];
    const startDay = moment(itm.StartTime).format('YYYY/MM/DD/HH');

    const dayOrNight = startDay.split('/').pop() === '18' ? 'night' : 'day';
    const weatherCode = get7DaysElement.value(ElementName['天氣現象'])[idx]
      .ElementValue[0].WeatherCode;
    const picture = weatherStore.getWeatherPic(dayOrNight, weatherCode);

    const data = {
      coord: [startDay, elementValue[dataName]],
      symbol: `image://${picture}`,
      symbolSize: [25, 20],
      symbolOffset: offset,
    };

    if (dataName === 'MaxTemperature' && dayOrNight === 'day') {
      return data;
    } else if (dataName === 'MinTemperature' && dayOrNight === 'night') {
      return data;
    } else {
      return { coord: [startDay, elementValue[dataName]], symbol: 'none' };
    }
  });
}
</script>

<template>
  <canvas ref="chartRef" />
</template>

<style scoped></style>
