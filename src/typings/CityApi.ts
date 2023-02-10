export type CityApi = CityApiModel[];

export interface CityApiModel {
  country: string;
  lat: number;
  lon: number;
  name: string;
  state: string;
}
