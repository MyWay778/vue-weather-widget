import { inject, ref, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import createUrl from '@/helpers/createUrl'
import makeCityId from '@/helpers/makeCityId'
import type { City, CityResponse } from '@/entities/city/types'

const API_URL = 'http://api.openweathermap.org/geo/1.0/direct'
const LIMIT = '5'

export default function useFetchCityOptions(
  cityRequest: Ref<string>, // city search string
  enable?: MaybeRefOrGetter<boolean>, // enable/disable request, despite cityRequest value changing
  delay = 1000 // delay between requests for debouncing
) {
  const apiKey = inject<string>('api-key')
  if (!apiKey) {
    console.warn('useFetchCityOptions: api key was not injected!')
  }

  const url = createUrl(API_URL, [
    {
      key: 'limit',
      value: LIMIT
    },
    {
      key: 'appid',
      value: apiKey ?? ''
    }
  ])

  const options = shallowRef<City[]>([])

  const isLoading = ref(false)
  const isError = ref(false)

  let id = 0

  watch(cityRequest, newRequest => {
    if (id) {
      clearTimeout(id)
    }

    if (toValue(enable) === false) {
      return
    }

    if (options.value.length) {
      options.value = []
    }

    if (!newRequest) {
      options.value = []
      return
    }

    id = setTimeout(() => {
      id = 0
      isLoading.value = true
      isError.value = false

      url.searchParams.set('q', newRequest)

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`status: ${response.status} ${response.statusText}`)
          }
          return response.json() as Promise<CityResponse>
        })
        .then(
          json =>
            (options.value = json.map(({ name, country, lat, lon }) => ({
              id: makeCityId(lat, lon),
              name,
              country,
              lat,
              lon
            })))
        )
        .catch(error => {
          console.warn('useFetchCityOptions:', error)
          isError.value = true
        })
        .finally(() => {
          isLoading.value = false
        })
    }, delay)
  })
  return { options, isLoading, isError }
}
