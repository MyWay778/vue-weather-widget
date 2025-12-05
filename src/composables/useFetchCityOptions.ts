import { inject, ref, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { CityService, type City } from '@/entities/city'

export default function useFetchCityOptions(
  cityRequest: Ref<string>, // city search string
  enable?: MaybeRefOrGetter<boolean>, // enable/disable request, despite cityRequest value changing
  delay = 1000 // delay between requests for debouncing
) {
  const apiKey = inject<string>('api-key')
  if (!apiKey) {
    throw new Error('useFetchCityOptions: api key was not injected!')
  }

  const cityService = new CityService(apiKey)

  const options = shallowRef<City[]>([])
  const isLoading = ref(false)
  const isError = ref(false)
  let timeoutId = 0

  watch(cityRequest, newRequest => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Disable request if needed
    if (toValue(enable) === false) {
      return
    }

    // Reset options always
    if (options.value.length) {
      options.value = []
    }

    // newRequest is empty
    if (!newRequest) {
      options.value = [] // need to trigger reactivity
      return
    }

    timeoutId = setTimeout(() => {
      timeoutId = 0
      isLoading.value = true
      isError.value = false

      cityService
        .find(newRequest)
        .then(cities => {
          options.value = cities
        })
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
