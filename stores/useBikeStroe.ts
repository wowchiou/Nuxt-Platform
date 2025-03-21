import type { Tables } from '~/database/types';
import type { BikeStationWithAvailability } from '~/types/tdx';

export const useBikeStore = defineStore('bike-store', () => {
  const { sbGetBikeFavorite, sbAddBikeFavorite, sbDeleteBikeFavorite } =
    useSupabase();
  const { getBikeStationByCity } = useTDX();

  const bikeCities = computed(() => CITY_LIST.filter((city) => city.bike));
  const cityName = ref<string>('');
  const keyword = ref<string>('');

  const bikeStations = ref<BikeStationWithAvailability[]>([]);
  const activeStation = ref<BikeStationWithAvailability | null>(null);
  const favorList = ref<Tables<'bike_favorite'>['station_id'][]>([]);

  const bikeStationsWithFavor = computed(() =>
    bikeStations.value.map((s) => {
      return { ...s, isFavor: favorList.value.includes(s.StationID) };
    })
  );

  async function fetchBikeStations(city: string) {
    try {
      const res = await getBikeStationByCity(city);
      if (res?.data) bikeStations.value = res.data;
    } catch (error) {
      console.log(error);
      throw new Error('獲取YouBike站點失敗');
    }
  }

  async function fetchBikeFavorite() {
    try {
      const res = await sbGetBikeFavorite();
      if (res?.data) {
        favorList.value = res.data.map((f) => f.station_id);
      }
    } catch (error) {
      console.log(error);
      throw new Error('獲取收藏站點失敗');
    }
  }

  async function addBikeFavorite(stationID: string) {
    try {
      const res = await sbAddBikeFavorite(stationID);
      if (res?.data) favorList.value.push(res.data[0].station_id);
    } catch (error) {
      console.log(error);
      throw new Error('新增收藏站點失敗');
    }
  }

  async function removeBikeFavorite(stationID: string) {
    try {
      await sbDeleteBikeFavorite(stationID);
      favorList.value = favorList.value.filter((id) => id !== stationID);
    } catch (error) {
      console.log(error);
      throw new Error('移除收藏站點失敗');
    }
  }

  return {
    cityName,
    keyword,
    bikeStations,
    bikeCities,
    activeStation,
    favorList,
    bikeStationsWithFavor,
    fetchBikeStations,
    fetchBikeFavorite,
    addBikeFavorite,
    removeBikeFavorite,
  };
});
