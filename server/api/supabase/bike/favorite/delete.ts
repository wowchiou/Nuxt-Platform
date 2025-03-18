import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) return;

  const { userID, stationID } = body;

  const res = await supabase
    .from('bike_favorite')
    .delete()
    .match({ user_id: userID, station_id: stationID });

  return res;
});
