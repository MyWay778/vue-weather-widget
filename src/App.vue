<script setup lang="ts">
import SettingsIcon from './components/icons/SettingIcon.vue';
import SunIcon from './components/icons/SunIcon.vue';
import ButtonWIthIcon from './components/UI/ButtonWIthIcon.vue';
import CityPanel from './components/CityPanel.vue';
import ModalUi from './components/UI/ModalUi.vue';
import SettingsModal from './components/SettingsModal.vue';
import { computed, reactive, ref, unref, type ComputedRef, type Ref } from 'vue';
import type WeatherApi from './typings/WeatherApi';
import useFeatchWeather from './hooks/useFetchWeather';
import type CityEntity from './typings/CityEntity';
import type CityWeatherEntity from './typings/CityWeatherEntity';
import normalizeWeatherApi from './helpers/normalizeWeatherApi';

const cities: CityEntity[] = [
  {
    id: 2004688,
    name: 'Chita',
    country: 'RU',
    lat: 51.5085,
    lon: -0.1257
  },
  {
    id: 20046321,
    name: 'London',
    country: 'GB',
    lat: 51.5085,
    lon: -0.1257
  },
  {
    id: 3213213,
    name: 'Moscow',
    country: 'Ru',
    lat: 51.5085,
    lon: -0.1257
  }
];

const cityWeatherData: { data: Ref<WeatherApi | null>; isLoading: Ref<boolean> }[] = reactive([]);

cities.forEach(city => {
  cityWeatherData.push(useFeatchWeather(city));
});

const isLoading = computed(() => cityWeatherData.some(data => data.isLoading));

const cityWeatherEntities: ComputedRef<CityWeatherEntity[]> = computed(() =>
  cityWeatherData.reduce((cityWeatherEntities, city) => {
    const data = unref(city.data);
    if (data) {
      cityWeatherEntities.push(normalizeWeatherApi(data));
    }
    return cityWeatherEntities;
  }, [] as CityWeatherEntity[])
);

const isSettingsOpened = ref(false);
const clickOnSettingsHandler = () => {
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

    <div
      v-if="!cities.length"
      :class="styles.message">
      No city has been selected. Click on <SettingsIcon :class="styles.messageIcon" /> to add a city!
    </div>

    <CityPanel
      v-for="entity in cityWeatherEntities"
      :key="entity.id"
      :data="entity" />

    <ModalUi
      v-if="isSettingsOpened"
      @closeModal="isSettingsOpened = false">
      <SettingsModal :cities="cities" />
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
