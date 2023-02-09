import type CityEntity from '@/typings/CityEntity';
import type WeatherApi from '@/typings/WeatherApi';
import { ref, type Ref } from 'vue';

const API_URL = 'http://api.openweathermap.org/data/2.5/weather';
const UNITS = 'metric';
const API_KEY = 'd343b0b76a167af5f755356e611ca72f';

export default function useFeatchWeather(city: CityEntity) {
  const url = new URL(API_URL);
  url.searchParams.append('q', `${city.name},${city.country}`);
  url.searchParams.append('units', UNITS);
  url.searchParams.append('appid', API_KEY);

  const data: Ref<WeatherApi | null> = ref(null);
  const isLoading: Ref<boolean> = ref(true);

  setTimeout(() => {
    fetch(url)
      .then(response => response.json() as Promise<WeatherApi>)
      .then(json => (data.value = json))
      .then(() => (isLoading.value = false));
  }, 1000);

  return { data, isLoading };
}
