export default interface CityWeatherEntity {
  id: number;
  name: string;
  country: string;
  iconUrl: string;
  main: string;
  temp: number;
  feelsLike: number;
  description: string;
  windSpeed: number;
  windDeg: number;
  windDir: string;
  humidity: number;
  pressure: number;
  seaLevel?: number;
  visibility: number;
}
