import type { BikeStationWithAvailability, FetchTDX } from '~/types/tdx';

export const useTDX = () => {
  const { $api } = useNuxtApp();

  async function getBikeStationByCity(city: string) {
    return await $api<FetchTDX<BikeStationWithAvailability[]>>(
      `/api/tdx/bike?city=${city}`
    );
  }

  return {
    getBikeStationByCity,
  };
};
