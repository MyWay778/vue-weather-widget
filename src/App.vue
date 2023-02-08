<script setup lang="ts">
import SettingsIcon from './components/icons/SettingIcon.vue';
import SunIcon from './components/icons/SunIcon.vue';
import ButtonWIthIcon from './components/UI/ButtonWIthIcon.vue';
import CityPanel, { type CityPanelProps } from './components/CityPanel.vue';
import ModalUi from './components/UI/ModalUi.vue';
import SettingsModal from './components/SettingsModal.vue';
import { computed, onBeforeMount, reactive, ref, unref, watchEffect, type Ref } from 'vue';
import type WeatherApi from './typings/weatherApi';
import type { geocodingApi } from './typings/geocodingApi';
import getCityPanelProps from './helpers/getCItyPanelProps';
import useFeatchWeather from './hooks/useFetchWeather';
import type { CityEntity } from './typings/cityEntity';

const cities: CityEntity[] = [
  // {
  //   name: 'Chita',
  //   country: 'RU',
  //   lat: 51.5085,
  //   lon: -0.1257
  // },
  // {
  //   name: 'London',
  //   country: 'GB',
  //   lat: 51.5085,
  //   lon: -0.1257
  // },
  // {
  //   name: 'Moscow',
  //   country: 'Ru',
  //   lat: 51.5085,
  //   lon: -0.1257
  // }
];

const citiesData: { data: Ref<WeatherApi | null>; isLoading: Ref<boolean> }[] = reactive([]);

cities.forEach(city => {
  citiesData.push(useFeatchWeather(city));
});

const isLoading = computed(() => citiesData.some(data => data.isLoading));
// const cityPanelProps = [];
// const cityPanelProps = computed(() => {
//   console.log('computed');
//   return citiesData.filter(city => city.data).map(city => getCityPanelProps(city.data as any));
// });

const cityPanelProps = computed(() =>
  citiesData.reduce((panelProps, city) => {
    const data = unref(city.data);
    if (data) {
      panelProps.push(getCityPanelProps(data));
    }
    return panelProps;
  }, [] as CityPanelProps[])
);

const countryApi: geocodingApi = {
  name: 'London',
  lat: 51.5085,
  lon: -0.1257,
  country: 'GB'
};

const isSettingsOpened = ref(false);
const clickOnSettingsHandler = () => {
  console.log('click');
  isSettingsOpened.value = true;
};
</script>

<template>
  <div :class="styles.widgetContainer">
    <ButtonWIthIcon
      :class="styles.settingsBtn"
      @click="clickOnSettingsHandler">
      <SettingsIcon />
    </ButtonWIthIcon>

    <div
      v-if="isLoading"
      :class="styles.loader">
      <SunIcon :class="styles.loaderIcon" />
    </div>

    <div :class="styles.message">
      No city has been selected. Click on <SettingsIcon :class="styles.messageIcon" /> to add a city!
    </div>

    <CityPanel
      v-for="props in cityPanelProps"
      :key="props.title"
      :title="props.title"
      :iconUrl="props.iconUrl"
      :main="props.main"
      :temp="props.temp"
      :feels-like="props.feelsLike"
      :description="props.description"
      :wind-speed="props.windSpeed"
      :wind-deg="props.windDeg"
      :wind-dir="props.windDir"
      :pressure="props.pressure"
      :humidity="props.humidity"
      :sea-level="props.seaLevel"
      :visibility="props.visibility" />

    <ModalUi
      v-if="isSettingsOpened"
      @closeModal="isSettingsOpened = false">
      <SettingsModal :cities="[]" />
    </ModalUi>
  </div>
</template>

<style module="styles" lang="scss">
.widgetContainer {
  margin: 100px;

  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 60px;
  width: 260px;
  min-height: 292px;
  padding: 20px;
  border-radius: 10px;
  background-color: var(--white);
  box-shadow: 1px 1px 4px 0 var(--shadow);
}

.settingsBtn {
  position: absolute;
  top: 20px;
  right: 20px;

  &:hover {
    svg {
      transform: rotate(45deg);
    }
  }

  svg {
    transition: 0.5s;
  }
}

.loader {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  &Icon {
    width: 60px;
    height: 60px;

    :global {
      animation: rotation 2s linear infinite;
    }
  }
}

.message {
  position: absolute;
  top: 50%;
  text-align: center;
  font-size: 18px;
  transform: translateY(-50%);

  &Icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
}
</style>
