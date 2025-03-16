import type {
  ElementName,
  ElementValue,
  LocationLocation,
  WeatherError,
} from '~/types/weather';

export const useWeatherStore = defineStore('weather-store', () => {
  const cityName = ref<string>('臺北市');
  const { getHoursWeather, get7DaysWeather } = useWeather();
  const { setError } = useErrorStore();

  const weatherHours = ref<LocationLocation[] | null>(null);
  const weather7Days = ref<LocationLocation[] | null>(null);

  const getHoursElement = computed(() => {
    return (elementName: ElementName) => {
      if (!weatherHours.value) return [];
      const cityData = weatherHours.value.find(
        (itm) => itm.LocationName === cityName.value
      );
      if (!cityData) return [];
      return (
        cityData.WeatherElement.find((itm) => itm.ElementName === elementName)
          ?.Time ?? []
      );
    };
  });

  const get7DaysElement = computed(() => {
    return (elementName: ElementName) => {
      if (!weather7Days.value) return [];
      const cityData = weather7Days.value.find(
        (itm) => itm.LocationName === cityName.value
      );
      if (!cityData) return [];
      return (
        cityData.WeatherElement.find((itm) => itm.ElementName === elementName)
          ?.Time ?? []
      );
    };
  });

  function setCityName(name: string) {
    cityName.value = name;
  }

  function getWeatherPic(
    day: 'day' | 'night',
    weatherCode: ElementValue['WeatherCode']
  ) {
    return `https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${day}/${weatherCode}.svg`;
  }

  async function fetchHoursWeather() {
    if (weatherHours.value) return;
    try {
      const res = await getHoursWeather();
      console.log(res);
      weatherHours.value = res.records.Locations[0].Location;
    } catch (error) {
      errorHandler(error as WeatherError);
    }
  }

  async function fetch7DaysWeather() {
    if (weather7Days.value) return;
    try {
      const res = await get7DaysWeather();
      weather7Days.value = res.records.Locations[0].Location;
    } catch (error) {
      errorHandler(error as WeatherError);
    }
  }

  function errorHandler(error: WeatherError) {
    const { statusCode, statusMessage } = error;
    setError({
      error: statusMessage,
      customCode: statusCode ?? 500,
    });
  }

  return {
    cityName,
    setCityName,
    weatherHours,
    weather7Days,
    fetchHoursWeather,
    fetch7DaysWeather,
    getHoursElement,
    get7DaysElement,
    getWeatherPic,
  };
});
