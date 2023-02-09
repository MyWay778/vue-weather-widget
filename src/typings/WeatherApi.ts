export default interface WeatherApi {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    id: number;
    country: string;
  };
  name: string;
}
