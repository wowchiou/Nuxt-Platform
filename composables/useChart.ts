import type { EChartsOption } from 'echarts';
import { ElementName } from '~/types/weather';
import moment from 'moment';

export const useChart = () => {
  const weatherStore = useWeatherStore();
  const { get7DaysElement } = storeToRefs(weatherStore);

  const chartColor = {
    white: '#fff',
    'light-gray': '#e2e8f0',
    'dark-gray': '#999',
    orange: '#fa5',
    blue: '#60A5FA',
  };

  // chart 基本樣式設定
  const grid = (option?: EChartsOption) => ({
    show: true,
    backgroundColor: chartColor['light-gray'], // **XY 軸內部的背景顏色**
    borderColor: chartColor['light-gray'], // **邊框顏色**
    borderWidth: 1, // **邊框寬度**
    left: '1%',
    right: '1%',
    top: '8%',
    bottom: '12%',
    ...option,
  });

  // 分割線樣式
  const splitLineStyle = (option?: EChartsOption) => ({
    color: chartColor['white'],
    opacity: 1,
    width: 1,
    type: 'solid',
    ...option,
  });

  // 軸線樣式
  const axisLineStyle = (option?: EChartsOption) => ({
    color: chartColor['dark-gray'], // 軸線顏色
    width: 1, // 軸線寬度
    ...option,
  });

  // 圖外標示樣式
  const legendStyle = (option?: EChartsOption) => ({
    show: true,
    itemGap: 10,
    selectedMode: false,
    left: 0,
    ...option,
  });

  // 指引線樣式
  const axisPointerLineStyle = (option?: EChartsOption) => ({
    color: chartColor['dark-gray'],
    opacity: 0.2,
    width: 1,
    type: 'solid',
    ...option,
  });

  // 指引標籤樣式
  const axisPointerLabelStyle = (option?: EChartsOption) => ({
    show: true,
    backgroundColor: chartColor['dark-gray'],
    color: chartColor['white'],
    padding: [5, 10],
    fontSize: 12,
    ...option,
  });

  // 資料點位文字樣式
  const seriesLabelStyle = (option?: EChartsOption) => ({
    show: true,
    position: 'top',
    color: '#999',
    fontSize: 14,
    ...option,
  });

  // 分隔線的顯示條件：每隔一天顯示分隔線
  function dividerWeatherDay(value: string) {
    const hours = value.split('/').pop();

    if (!hours) return '';

    const date = moment(value).format('MM/DD');

    return hours !== '18' ? date : '';
  }

  // 軸的顯示條件：白天和晚上分開顯示
  function showDayOrNightAxis(value: string) {
    const hours = value.split('/').pop();

    if (!hours) return '';

    const isNight = ['18', '00'].includes(hours);
    const date = moment(value, 'YYYY/MM/DD/HH').format('MM/DD');
    const week = dayWeek(value, 'YYYY/MM/DD');

    return isNight ? '晚上' : `白天\n\n${date}(${week})`;
  }

  function getWeatherDateData(elementName: ElementName) {
    return get7DaysElement.value(elementName).reduce((acc, itm) => {
      const start = moment(itm.StartTime).format('YYYY/MM/DD/HH');
      const end = moment(itm.EndTime).format('YYYY/MM/DD/HH');
      if (!acc.includes(start)) acc.push(start);
      if (!acc.includes(end)) acc.push(end);

      return acc;
    }, [] as string[]);
  }

  return {
    chartColor,
    grid,
    splitLineStyle,
    axisLineStyle,
    legendStyle,
    axisPointerLineStyle,
    axisPointerLabelStyle,
    seriesLabelStyle,
    dividerWeatherDay,
    showDayOrNightAxis,
    getWeatherDateData,
  };
};
