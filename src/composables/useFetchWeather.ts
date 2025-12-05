import type WeatherApi from '@/typings/api/WeatherApi'
import { inject, ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import createUrl from '@/helpers/createUrl'
import { normalizeWeatherApi, type Weather } from '@/entities/weather'
import type { City } from '@/entities/city'

const API_URL = 'http://api.openweathermap.org/data/2.5/weather'
const UNITS = 'metric'

export default function useFetchWeather(city: City, minDuration = 0) {
  const apiKey = inject<string>('api-key')
  if (!apiKey) {
    console.warn('useFetchWeather: api key was not injected!')
  }

  const queryParams = [
    {
      key: 'units',
      value: UNITS
    },
    {
      key: 'appid',
      value: apiKey ?? ''
    }
  ]

  // if cityEntity has name and country request by them
  if (city.name && city.country) {
    queryParams.push({
      key: 'q',
      value: `${city.name},${city.country}`
    })
  } else {
    // or search by latitude and longitude
    queryParams.push(
      {
        key: 'lat',
        value: String(city.lat)
      },
      {
        key: 'lon',
        value: String(city.lon)
      }
    )
  }

  const url = createUrl(API_URL, queryParams)

  const data = shallowRef<Weather>()
  const isLoading = ref<boolean>(true)
  const isError = ref<boolean>(false)

  // if minimum duration is set, get the time now
  const startTime = minDuration ? Date.now() : 0

  const setData = (json: WeatherApi) => {
    data.value = normalizeWeatherApi(json)
    isLoading.value = false
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`status: ${response.status} ${response.statusText}`)
      }
      return response.json() as Promise<WeatherApi>
    })
    .then(json => {
      const endTime = minDuration ? Date.now() : 0
      const timeDiff = endTime - startTime

      if (minDuration && timeDiff < minDuration) {
        setTimeout(() => {
          setData(json)
        }, minDuration - timeDiff)
      } else {
        setData(json)
      }
    })
    .catch(error => {
      console.warn('useFetchWeather:', error)
      isError.value = true
      isLoading.value = false
    })

  return { data, isLoading, isError }
}
