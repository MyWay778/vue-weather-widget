import type CityWeatherEntity from '@/typings/models/CityWeatherEntity';
import type WeatherApi from '@/typings/api/WeatherApi';
import capitalizeFirstLetter from './capitalizeFirstLetter';
import changeNumberPrecision from './changeNumberPrecision';
import convertMetersToKm from './convertMetersToKm';
import getIconUrl from './getIconUrl';
import getWindDirection from './getWindDirection';

export default function normalizeWeatherApi(weatherData: WeatherApi): CityWeatherEntity {
  return {
    id: weatherData.sys.id,
    name: weatherData.name,
    country: weatherData.sys.country,
    iconUrl: getIconUrl(weatherData.weather[0].icon),
    main: weatherData.weather[0].main,
    temp: Math.round(weatherData.main.temp),
    feelsLike: Math.round(weatherData.main.feels_like),
    description: capitalizeFirstLetter(weatherData.weather[0].description),
    windSpeed: weatherData.wind.speed,
    windDeg: weatherData.wind.deg,
    windDir: getWindDirection(weatherData.wind.deg),
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    seaLevel: weatherData.main.sea_level && changeNumberPrecision(convertMetersToKm(weatherData.main.sea_level)),
    visibility: convertMetersToKm(weatherData.visibility)
  };
}
