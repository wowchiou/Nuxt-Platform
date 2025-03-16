import type { WeatherRecords, WeatherData } from '~/types/weather';

export const useWeather = () => {
  const { $api } = useNuxtApp();

  const weatherTimeText: {
    [key: string]: string;
  } = {
    '00': '凌晨',
    '06': '早上',
    '12': '下午',
    '18': '晚上',
  };

  async function getHoursWeather() {
    return await $api<WeatherData<WeatherRecords>>('/api/weather/F-D0047-089');
  }

  async function get7DaysWeather() {
    return await $api<WeatherData<WeatherRecords>>('/api/weather/F-D0047-091');
  }

  return {
    weatherTimeText,
    getHoursWeather,
    get7DaysWeather,
  };
};
