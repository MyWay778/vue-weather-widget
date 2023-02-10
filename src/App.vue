<script setup lang="ts">
import SettingsIcon from './components/icons/SettingIcon.vue';
import SunIcon from './components/icons/SunIcon.vue';
import ButtonWIthIcon from './components/UI/ButtonWIthIcon.vue';
import CityPanel from './components/CityPanel.vue';
import ModalUi from './components/UI/ModalUi.vue';
import SettingsModal from './components/SettingsModal/SettingsModal.vue';
import { computed, reactive, ref, unref, type ComputedRef, type Ref } from 'vue';
import type WeatherApi from './typings/WeatherApi';
import useFeatchWeather from './hooks/useFetchWeather';
import type CityEntity from './typings/CityEntity';
import type CityWeatherEntity from './typings/CityWeatherEntity';
import normalizeWeatherApi from './helpers/normalizeWeatherApi';

const cities = ref<CityEntity[]>([
  // {
  //   id: 8890,
  //   name: 'Chita',
  //   country: 'RU',
  //   lat: 51.5085,
  //   lon: -0.1257
  // },
  {
    id: 2075535,
    name: 'London',
    country: 'GB',
    lat: 51.5085,
    lon: -0.1257
  },
  {
    id: 2018597,
    name: 'Moscow',
    country: 'Ru',
    lat: 51.5085,
    lon: -0.1257
  }
]);

const cityWeatherData = computed(() => {
  return cities.value.map(useFeatchWeather);
});

// const isLoading = computed(() => cityWeatherData.value.some(data => data.isLoading));
const isLoading = false;

const cityWeatherEntities: ComputedRef<CityWeatherEntity[]> = computed(() =>
  cityWeatherData.value.reduce((cityWeatherEntities, city) => {
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

const reorderCitiesHandler = (updatedCities: CityEntity[]) => {
  cities.value = updatedCities;
};

const onRemoveCity = (cityId: number) => {
  cities.value = cities.value.filter(city => city.id !== cityId);
};

const onAddCity = (city: CityEntity): void => {
  cities.value.push(city);
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
      <SettingsModal
        :cities="cities"
        @reorderCities="reorderCitiesHandler"
        @remove-city="onRemoveCity"
        @add-city="onAddCity"/>
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
