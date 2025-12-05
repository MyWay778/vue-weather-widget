import { capitalizeFirstLetter, changeNumberPrecision, convertMetersToKm } from '@/helpers'
import type WeatherApiModel from '../types/weather-api-model'
import { getWindDirection as getWindDirectionHelper } from '../utils'

export class Weather {
  public id: number
  public name: string
  public country: string
  public iconUrl: string
  public main: string
  public temp: number
  public feelsLike: number
  public description: string
  public windSpeed: number
  public windDeg: number
  public windDir: string
  public humidity: number
  public pressure: number
  public seaLevel?: number
  public visibility: number

  constructor(weather: WeatherApiModel) {
    this.id = weather.sys.id
    this.name = weather.name
    this.country = weather.sys.country
    this.iconUrl = weather.weather[0]?.icon ? Weather.getIconUrl(weather.weather[0].icon) : ''
    this.main = weather.weather[0]?.main ?? ''
    this.temp = Math.round(weather.main.temp)
    this.feelsLike = Math.round(weather.main.feels_like)
    this.description = weather.weather[0]?.description ? capitalizeFirstLetter(weather.weather[0].description) : ''
    this.windSpeed = weather.wind.speed
    this.windDeg = weather.wind.deg

    this.windDir = Weather.getWindDirection(weather.wind.deg)
    this.humidity = weather.main.humidity
    this.pressure = weather.main.pressure
    this.seaLevel = weather.main.sea_level && changeNumberPrecision(convertMetersToKm(weather.main.sea_level))
    this.visibility = changeNumberPrecision(convertMetersToKm(weather.visibility))
  }

  static getIconUrl(icon: string): string {
    const BASE_URL = 'http://openweathermap.org'
    return `${BASE_URL}/img/wn/${icon}@2x.png`
  }

  static getWindDirection(deg: number): string {
    return getWindDirectionHelper(deg)
  }
}
