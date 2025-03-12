export function getUserPosition(): Promise<[number, number] | false> {
  return new Promise((resolve, reject) => {
    if ('geolocation' in window.navigator) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          resolve(false);
        }
      );
    } else {
      resolve(false);
    }
  });
}
