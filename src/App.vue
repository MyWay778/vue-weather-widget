<script setup lang="ts">
import { ref, watch } from 'vue';
import { CityPanel } from '@/components/weather/';
import { SettingsModal } from '@/components/settings/';
import { getStorage } from '@/helpers/';
import { addOrUpdateCurrentCity } from '@/modules/app';
import { DefaultHomeMessage, SettingsButton, AppContainer } from '@/components/home/';
import { ModalUi } from '@/components/ui';
import type CityEntity from '@/typings/models/CityEntity';

const STORAGE_KEY = 'weatherWidget';
const cityStorage = getStorage<CityEntity[]>(STORAGE_KEY);
const cityFromStorage = cityStorage.get({ isStringify: true }) ?? [];

const cities = ref(cityFromStorage);
watch(cities, newCities => {
  cityStorage.save(newCities);
});

const currentCityIndex = cities.value.findIndex(c => c.currentPos);

// get new or update user current position
addOrUpdateCurrentCity(cities, currentCityIndex);

const isSettingsOpened = ref(false);
const clickOnSettingsHandler = () => {
  isSettingsOpened.value = true;
};

const reorderCitiesHandler = (updatedCities: CityEntity[]) => {
  cities.value = updatedCities;
};

const onRemoveCity = (cityId: string) => {
  cities.value = cities.value.filter(city => city.id !== cityId);
};

const onAddCity = (city: CityEntity): void => {
  const foundCity = cities.value.find(c => c.id === city.id);
  if (foundCity) {
    return;
  }

  cities.value = cities.value.concat(city);
};

const onUpdateCity = (city: CityEntity): void => {
  const foundCityIndex = cities.value.findIndex(c => c.id === city.id);

  if (foundCityIndex > -1) {
    cities.value[foundCityIndex] = city;
  }
};
</script>

<template>
  <main id="root">
    <AppContainer>
      <SettingsButton @click="clickOnSettingsHandler" />

      <DefaultHomeMessage v-if="!cities.length" />

      <CityPanel
        v-for="city in cities"
        :key="city.id"
        :city="city"
        @update-city="onUpdateCity" />

      <ModalUi
        v-if="isSettingsOpened"
        @close-modal="isSettingsOpened = false">
        <SettingsModal
          :cities="cities"
          @reorderCities="reorderCitiesHandler"
          @remove-city="onRemoveCity"
          @add-city="onAddCity" />
      </ModalUi>
    </AppContainer>
  </main>
</template>

<style>
@import './styles/index.css';
</style>
