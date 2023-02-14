import { inject, ref, watch, type Ref } from 'vue';
import type CityEntity from '@/typings/models/CityEntity';
import type { CityApi } from '@/typings/api/CityApi';
import createUrl from '@/helpers/createUrl';
import makeCityId from '@/helpers/makeCityId';

const API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const LIMIT = '5';

export default function useFetchCityOptions(cityRequest: Ref<string>, delay = 1000) {
  const apiKey = inject<string>('apiKey');
  if (!apiKey) {
    console.warn('useFetchCityOptions: api key was not injected!');
  }

  const url = createUrl(API_URL, [
    {
      key: 'limit',
      value: LIMIT
    },
    {
      key: 'appid',
      value: apiKey ?? ''
    }
  ]);

  const options = ref<CityEntity[]>([]);

  const isLoading = ref(false);
  const isError = ref(false);

  let id = 0;
  watch(cityRequest, newRequest => {
    if (id) {
      clearTimeout(id);
    }

    if (!newRequest) {
      options.value = [];
      return;
    }

    id = setTimeout(() => {
      id = 0;
      isLoading.value = true;
      isError.value = false;

      url.searchParams.set('q', newRequest);

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`status: ${response.status} ${response.statusText}`);
          }
          return response.json() as Promise<CityApi>;
        })
        .then(
          json =>
            (options.value = json.map(({ name, country, lat, lon }) => ({
              id: makeCityId(lat, lon),
              name,
              country,
              lat,
              lon
            })))
        )
        .catch(error => {
          console.warn('useFetchCityOptions:', error);
          isError.value = true;
          isLoading.value = false;
        });
    }, delay);
  });
  return { options, isLoading, isError };
}
