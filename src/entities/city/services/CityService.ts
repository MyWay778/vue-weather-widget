import { createUrl } from '@/helpers'
import type { CityResponse } from '../types'
import { City } from '../models/City'

export class CityService {
  private limit = '5'
  private baseUrl = 'http://api.openweathermap.org/geo/1.0/'

  constructor(private apiKey: string) {}

  async getByCords(lat: number | string, lon: number | string) {
    const endpoint = 'reverse'

    const url = createUrl(
      [endpoint, this.baseUrl],
      [
        {
          key: 'limit',
          value: this.limit
        },
        {
          key: 'appid',
          value: this.apiKey
        },
        {
          key: 'lat',
          value: String(lat)
        },
        {
          key: 'lon',
          value: String(lon)
        }
      ]
    )

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status: ${response.status} ${response.statusText}`)
        }

        return response.json() as Promise<CityResponse>
      })
      .then(json => {
        if (json.length !== 0) {
          return new City(json[0]!)
        } else {
          return null
        }
      })
      .catch(error => {
        console.warn('CityService->getByCords', (error as Error).message)
        throw new Error('Error occurred!')
      })
  }

  async find(query: string) {
    const endpoint = 'direct'

    const url = createUrl(
      [endpoint, this.baseUrl],
      [
        {
          key: 'limit',
          value: this.limit
        },
        {
          key: 'appid',
          value: this.apiKey
        },
        {
          key: 'q',
          value: query
        }
      ]
    )

    try {
      const citiesResponse = await fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`status: ${response.status} ${response.statusText}`)
        }
        return response.json() as Promise<CityResponse>
      })

      return citiesResponse.map(cityResponse => new City(cityResponse))
    } catch (error) {
      console.warn('CityService->findCity:', error)
      throw new Error('Error occurred')
    }
  }
}
