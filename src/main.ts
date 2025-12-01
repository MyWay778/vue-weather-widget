import { defineCustomElement } from 'vue';
import App from '@/App.vue';

const serviceApiKey = import.meta.env.VITE_WEATHER_SERVICE_API_KEY;
if (!serviceApiKey) {
  throw new Error('Weather Service Api key was not defined!');
}

const customElementApp = defineCustomElement(App, {
  configureApp(app) {
    app.provide('api-key', serviceApiKey);
  }
});

customElements.define('weather-widget', customElementApp);
