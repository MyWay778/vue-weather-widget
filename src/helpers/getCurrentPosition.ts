const options = {
  timeout: 5000,
  maximumAge: Infinity
};

export default function getCurrentPosition(
  callback: (pos: GeolocationPosition) => void,
  errorCallback?: (error: GeolocationPositionError) => void
) {
  navigator.geolocation.getCurrentPosition(callback, errorCallback, options);
}
