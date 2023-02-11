export default function makeCityId(lat: number, lon: number): string {
  return `${lat}&${lon}`;
}
