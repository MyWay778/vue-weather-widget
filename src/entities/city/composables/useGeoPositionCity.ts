import { inject, type Ref } from 'vue'
import { getCurrentPosition as getCurrentPositionHelper } from '@/helpers'
import { CityService } from '../services/CityService'
import type { City } from '../models/City'

export function useGeoPositionCity(cities: Ref<City[]>) {
  const apiKey = inject<string>('api-key')
  if (!apiKey) {
    throw new Error('useFetchCityOptions: api key was not injected!')
  }

  const cityService = new CityService(apiKey)

  if (!cities.value.length) {
    getCurrentPosition().then(city => {
      if (!city) return
      cities.value = [city]
    })
  } else {
    const currentCityIndex = cities.value.findIndex(c => Boolean(c.currentPos))
    if (currentCityIndex !== -1) {
      updatePosition(cities.value[currentCityIndex]!)
        .then(city => {
          if (!city) {
            cities.value[currentCityIndex]!.currentPos = false
            return
          }

          cities.value[currentCityIndex] = city
        })
        .catch(() => {
          cities.value[currentCityIndex]!.currentPos = false
        })
    }
  }

  function getCurrentPosition(): Promise<City | null> {
    return new Promise((resolve, reject) => {
      getCurrentPositionHelper(pos => {
        const { coords } = pos
        cityService
          .getByCords(coords.latitude, coords.longitude)
          .then(city => {
            _setCurrentPosition(city)
            resolve(city)
          })
          .catch(reject)
      })
    })
  }

  function updatePosition(city: City): Promise<City | null> {
    return new Promise((resolve, reject) => {
      getCurrentPositionHelper(pos => {
        const { coords } = pos

        if (city.lat === coords.latitude || city.lon === coords.longitude) {
          resolve(city)
        } else {
          cityService
            .getByCords(coords.latitude, coords.longitude)
            .then(city => {
              _setCurrentPosition(city)
              resolve(city)
            })
            .catch(reject)
        }
      }, reject)
    })
  }

  function _setCurrentPosition(city?: City | null) {
    if (city) {
      city.currentPos = true
    }
  }

  return {
    getCurrentPosition,
    updatePosition
  }
}
