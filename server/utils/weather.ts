export const weatherAPI = async () => {
  return $fetch.create({
    baseURL: 'https://opendata.cwa.gov.tw/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
