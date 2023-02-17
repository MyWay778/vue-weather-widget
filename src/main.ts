import { createApp } from 'vue';
import App from '@/App.vue';
import { sanitizeInput, excludedChars, setStyles } from '@/helpers';

import './styles/main.scss';

const ROOT_NAME = 'weather-widget';
const rootStyles: Partial<CSSStyleDeclaration> = { display: 'inline-block' };

initApp();

function initApp() {
  const root = document.querySelector<HTMLElement>(ROOT_NAME);
  if (!root) return;

  // check if a custom element with root name already exists
  if (customElements.get(ROOT_NAME)) {
    console.warn('Weather Widget: The weather-widget tag is reserved!');
    return;
  }

  // api key for requests from API
  let apiKey = root.getAttribute('api-key');
  if (!apiKey) {
    console.warn('Weather Widget: You need to define an api-key attribute!');
    return;
  }

  // styling root element
  setStyles(root, rootStyles);

  // exclude potentially dangerous characters from api key
  apiKey = sanitizeInput(apiKey, excludedChars.safeText);

  const app = createApp(App);

  // provide apiKey for useFetch functions
  app.provide('apiKey', apiKey);

  app.mount(root);
}
