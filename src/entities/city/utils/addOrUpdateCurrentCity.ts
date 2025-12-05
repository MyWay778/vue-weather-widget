import type { Ref } from 'vue'
import type CityEntity from '@/typings/models/CityEntity'
import { getCurrentPosition, makeCityId } from '@/helpers'

export function addOrUpdateCurrentCity(cities: Ref<CityEntity[]>, currentCityIndex: number): void {
  // if there is no city get the current position
  if (!cities.value.length) {
    getCurrentPosition(pos => {
      const { coords } = pos
      cities.value.push(createCurrentCityEntity(coords))
    })
  } else if (currentCityIndex > -1) {
    // if there is a current position in the storage, update the user's position
    getCurrentPosition(
      pos => {
        const { coords } = pos
        const updatedCurrentCity = createCurrentCityEntity(coords)

        const citiesCopy = [...cities.value]
        // replace old current position
        citiesCopy.splice(currentCityIndex, 1, updatedCurrentCity)

        cities.value = citiesCopy
      },
      () => {
        // if it was not possible to get the current position, disable the current position option,
        // because the saved position may be incorrect
        cities.value = cities.value.map(c => {
          if (c.currentPos) {
            c.currentPos = false
          }

          return c
        })
      }
    )
  }
}

function createCurrentCityEntity(coords: GeolocationCoordinates): CityEntity {
  return {
    id: makeCityId(coords.latitude, coords.longitude),
    name: '',
    country: '',
    lat: coords.latitude,
    lon: coords.longitude,
    currentPos: true
  }
}
