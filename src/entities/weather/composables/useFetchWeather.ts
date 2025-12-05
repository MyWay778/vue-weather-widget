import { inject, ref, shallowRef } from 'vue'
import { WeatherService, type Weather } from '@/entities/weather'
import type { City } from '@/entities/city'

export function useFetchWeather(city: City, minDuration = 0) {
  const apiKey = inject<string>('api-key')
  if (!apiKey) {
    throw new Error('useFetchWeather: api key was not injected!')
  }

  const data = shallowRef<Weather>()
  const isLoading = ref<boolean>(true)
  const isError = ref<boolean>(false)

  const weatherService = new WeatherService(apiKey)

  const startTime = minDuration ? Date.now() : 0

  weatherService
    .getWeather(city)
    .then(weather => {
      const endTime = minDuration ? Date.now() : 0
      const timeDiff = endTime - startTime

      if (minDuration && timeDiff < minDuration) {
        return new Promise<Weather>(resolve => {
          setTimeout(() => {
            resolve(weather)
          }, minDuration - timeDiff)
        })
      } else {
        return weather
      }
    })
    .then(weather => {
      data.value = weather
    })
    .catch(() => {
      isError.value = true
    })
    .finally(() => {
      isLoading.value = false
    })

  return { data, isLoading, isError }
}
