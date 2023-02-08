export default interface WeatherApi {
  coord: Coord;
  weather: Weather[];
  main: Main;
  visibility: number;
  wind: Wind;
  sys: {
    id: number;
    country: string;
  };
  name: string;
}

interface Coord {
  lon: number;
  lat: number;
}

interface Weather {
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
}

interface Wind {
  speed: number;
  deg: number;
}
