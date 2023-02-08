const BASE_URL = 'http://openweathermap.org';

export default function getIconUrl(icon: string): string {
  return `${BASE_URL}/img/wn/${icon}@2x.png`;
}
