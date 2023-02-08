import createUrl from '@/helpers/createUrl';
import type { geocodingApi } from '@/typings/geocodingApi';
import { ref, watch, type Ref } from 'vue';

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

export default function useCitySuggestions(cityInput: Ref<string>, delay = 1000): Ref<string[]> {
  const suggestions: Ref<string[]> = ref([]);

  let id = 0;
  watch(cityInput, newInput => {
    if (id) {
      clearTimeout(id);
    }

    if (!newInput) {
      suggestions.value = [];
      return;
    }

    id = setTimeout(() => {
      id = 0;
      url.searchParams.set('q', newInput);

      fetch(url)
        .then(response => response.json() as Promise<geocodingApi[]>)
        .then(json => (suggestions.value = json.map(s => `${s.name}, ${s.country}`)));
    }, delay);
  });
  return suggestions;
}
