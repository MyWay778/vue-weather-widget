export default interface CityEntity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  currentPos?: boolean;
}
