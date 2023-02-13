import type CityEntity from '@/typings/models/CityEntity';
import type WeatherApi from '@/typings/api/WeatherApi';
import { ref, type Ref } from 'vue';

const API_URL = 'http://api.openweathermap.org/data/2.5/weather';
const UNITS = 'metric';
const API_KEY = 'd343b0b76a167af5f755356e611ca72f';

export interface CityApiData {
  data: Ref<WeatherApi | undefined>;
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
}

export default function useFeatchWeather(city: CityEntity, minDelay = 0): CityApiData {
  const url = new URL(API_URL);
  url.searchParams.append('q', `${city.name},${city.country}`);
  url.searchParams.append('units', UNITS);
  url.searchParams.append('appid', API_KEY);

  const data = ref<WeatherApi>();
  const isLoading = ref<boolean>(true);
  const isError = ref<boolean>(false);

  const startTime = Date.now();

  const setData = (json: WeatherApi) => {
    data.value = json;
    isLoading.value = false;
  };

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`status: ${response.status} ${response.statusText}`);
      }
      return response.json() as Promise<WeatherApi>;
    })
    .then(json => {
      const endTime = Date.now();
      const timeDiff = endTime - startTime;
      if (minDelay && timeDiff < minDelay) {
        setTimeout(() => {
          setData(json);
        }, minDelay - timeDiff);
      } else {
        setData(json);
      }
    })
    .catch(error => {
      console.warn('useFeatchWeather:', error);
      isError.value = true;
      isLoading.value = false;
    });

  return { data, isLoading, isError };
}
