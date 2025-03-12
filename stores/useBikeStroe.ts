import type { BikeStationWithAvailability } from '~/types/tdx';

export const useBikeStore = defineStore('bike-store', () => {
  const { getBikeStationByCity } = useTDX();

  const cityName = ref<string>('');
  const keyword = ref<string>('');
  const bikeStations = ref<BikeStationWithAvailability[]>([]);
  const activeStation = ref<BikeStationWithAvailability | null>(null);
  const bikeCities = computed(() => CITY_LIST.filter((city) => city.bike));

  async function fetchBikeStations(city: string) {
    try {
      const res = await getBikeStationByCity(city);
      if (res?.data) bikeStations.value = res.data;
    } catch (error) {
      console.log(error);
      throw new Error('獲取YouBike站點失敗');
    }
  }

  return {
    cityName,
    keyword,
    bikeStations,
    bikeCities,
    activeStation,
    fetchBikeStations,
  };
});
