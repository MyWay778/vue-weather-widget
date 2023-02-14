const options = {
  timeout: 5000,
  maximumAge: Infinity
};

export default function getCurrentPosition(callback: (pos: GeolocationPosition) => void) {
  navigator.geolocation.getCurrentPosition(callback, null, options);
}
