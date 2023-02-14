import { createApp } from 'vue';
import App from './App.vue';
import sanitizeInput, { excludedChars } from './helpers/sanitizeInput';

import './styles/main.scss';

const ELEMENT_NAME = 'weather-widget';
const rootStyles = 'display:inline-block;';

initApp();

function initApp() {
  const root = document.querySelector<HTMLElement>(ELEMENT_NAME);
  if (!root) return;

  if (customElements.get(ELEMENT_NAME)) {
    console.warn('Weather Widget: The weather-widget tag is reserved!');
    return;
  }

  let apiKey = root.getAttribute('api-key');
  if (!apiKey) {
    console.warn('Weather Widget: You need to define an api-key attribute!');
    return;
  }

  root.style.cssText = rootStyles;

  apiKey = sanitizeInput(apiKey, excludedChars.safeText);

  createApp(App, { apiKey }).mount(root);
}
