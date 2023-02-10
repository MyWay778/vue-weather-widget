import { ref, watch, type Ref } from 'vue';
import type CityEntity from '@/typings/CityEntity';
import type { CityApi } from '@/typings/CityApi';
import createUrl from '@/helpers/createUrl';

const API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const LIMIT = '5';
const API_KEY = 'd343b0b76a167af5f755356e611ca72f';

const url = createUrl(API_URL, [
  {
    key: 'limit',
    value: LIMIT
  },
  {
    key: 'appid',
    value: API_KEY
  }
]);

export default function useFetchCityOptions(cityRequest: Ref<string>, delay = 1000): Ref<CityEntity[]> {
  const options = ref<CityEntity[]>([]);

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
      url.searchParams.set('q', newRequest);

      fetch(url)
        .then(response => response.json() as Promise<CityApi>)
        .then(
          json =>
            (options.value = json.map(({ name, country, lat, lon }, index) => ({ id: index, name, country, lat, lon })))
        );
    }, delay);
  });
  return options;
}
