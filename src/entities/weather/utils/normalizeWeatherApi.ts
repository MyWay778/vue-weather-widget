import type { WeatherApi } from '@/typings/api/'
import {
  capitalizeFirstLetter,
  changeNumberPrecision,
  convertMetersToKm,
  getIconUrl,
  getWindDirection
} from '@/helpers/'
import type { Weather } from '../types'

// normalize weather api data response for rendering
export function normalizeWeatherApi(weatherData: WeatherApi): Weather {
  return {
    id: weatherData.sys.id,
    name: weatherData.name,
    country: weatherData.sys.country,
    iconUrl: weatherData.weather[0]?.icon ? getIconUrl(weatherData.weather[0].icon) : '',
    main: weatherData.weather[0]?.main ?? '',
    temp: Math.round(weatherData.main.temp),
    feelsLike: Math.round(weatherData.main.feels_like),
    description: weatherData.weather[0]?.description ? capitalizeFirstLetter(weatherData.weather[0].description) : '',
    windSpeed: weatherData.wind.speed,
    windDeg: weatherData.wind.deg,
    windDir: getWindDirection(weatherData.wind.deg),
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    seaLevel: weatherData.main.sea_level && changeNumberPrecision(convertMetersToKm(weatherData.main.sea_level)),
    visibility: changeNumberPrecision(convertMetersToKm(weatherData.visibility))
  }
}
