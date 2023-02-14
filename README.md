# vue-weather-widget

Weather Widget

### Technology stack 
* Vue3 (Composition API)
* TypeScript
* Vite

### Features
* Requests your current position.
* Can show the weather in three cities.
* You can change the order of the cities.
* Stores in the browser's local storage.

## Usage
1) Download the dist file (weather-widget.js)
2) Add the widget and script tags in your index.html
    ```html
    <script src="/weather-widget.js"></script>
    <weather-widget></weather-widget>
    ```
3) Set api-key attribute
    ```html
    <weather-widget api-key={your api key}></weather-widget>
    ```

To get an API key, you need to register with [OpenWeather](https://openweathermap.org/). You need a free key. Or you can use mine :)
```sh
d343b0b76a167af5f755356e611ca72f
```
## Development setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Create dist

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
