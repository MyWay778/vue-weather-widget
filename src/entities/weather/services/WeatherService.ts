import type { City } from '@/entities/city'
import { createUrl } from '@/helpers'
import type WeatherApiModel from '../types/weather-api-model'
import { Weather } from '../models/Weather'

export class WeatherService {
  private url = 'http://api.openweathermap.org/data/2.5/weather'
  private units = 'metric'

  constructor(private apiKey: string) {}

  async getWeather(city: City) {
    const url = createUrl(this.url, [
      {
        key: 'units',
        value: this.units
      },
      {
        key: 'appid',
        value: this.apiKey
      },
      // Find Weather by city name and country or by latitude longitude
      ...(city.name && city.country
        ? [{ key: 'q', value: `${city.name},${city.country}` }]
        : [
            { key: 'lat', value: String(city.lat) },
            { key: 'lon', value: String(city.lon) }
          ])
    ])

    try {
      const weatherResponse = await fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`status: ${response.status} ${response.statusText}`)
        }
        return response.json() as Promise<WeatherApiModel>
      })

      return new Weather(weatherResponse)
    } catch (error) {
      console.warn('WeatherService->getWeather:', (error as Error).message)
      throw new Error('Error occurred')
    }
  }
}
