import type { CityApiModel, CityModel } from '../types'

export class City implements CityModel {
  public id: string
  public name: string
  public country: string
  public lat: number
  public lon: number
  public currentPos?: boolean

  constructor(city: CityApiModel) {
    this.id = City.makeId(city.lat, city.lon)
    this.name = city.name
    this.country = city.country
    this.lat = city.lat
    this.lon = city.lon
  }

  static makeId(lat: number, lon: number): string {
    return `${lat}&${lon}`
  }
}
