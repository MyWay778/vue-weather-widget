import type CityEntity from '@/typings/models/CityEntity';
import type WeatherApi from '@/typings/api/WeatherApi';
import { inject, ref, type Ref } from 'vue';
import createUrl from '@/helpers/createUrl';

const API_URL = 'http://api.openweathermap.org/data/2.5/weather';
const UNITS = 'metric';

export interface CityApiData {
  data: Ref<WeatherApi | undefined>;
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
}

export default function useFeatchWeather(city: CityEntity, minDelay = 0): CityApiData {
  const apiKey = inject<string>('apiKey');
  if (!apiKey) {
    console.warn('useFeatchWeather: api key was not injected!');
  }

  const url = createUrl(API_URL, [
    {
      key: 'lat',
      value: String(city.lat)
    },
    {
      key: 'lon',
      value: String(city.lon)
    },
    {
      key: 'units',
      value: UNITS
    },
    {
      key: 'appid',
      value: apiKey ?? ''
    }
  ]);

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
