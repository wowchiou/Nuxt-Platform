import { tdxAPI } from '~/server/utils/tdx';
import { BikeAvailability, BikeStations } from '~/types/tdx';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.city) return;

  try {
    const $tdxAPI = await tdxAPI();
    const [station, availability] = await Promise.all([
      $tdxAPI<BikeStations[]>(`/v2/Bike/Station/City/${query.city}`),
      $tdxAPI<BikeAvailability[]>(`/v2/Bike/Availability/City/${query.city}`),
    ]);

    const res = station.map((s) => {
      const a = availability.find((av) => av.StationUID === s.StationUID);
      return {
        ...s,
        availability: a,
      };
    });

    return { statusCode: 200, data: res };
  } catch (error) {
    console.log('server/api/tdx/bike', error);
    createError({
      statusCode: 500,
      message: '獲取 YouBike 站點失敗',
    });
  }
});
