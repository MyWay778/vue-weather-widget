<script setup lang="ts">
import SettingsIcon from './components/icons/SettingIcon.vue';
import ButtonWIthIcon from './components/UI/ButtonWIthIcon.vue';
import CityPanel from './components/CityPanel/CityPanel.vue';
import ModalUi from './components/UI/ModalUi.vue';
import SettingsModal from './components/SettingsModal/SettingsModal.vue';
import { provide, ref, watch } from 'vue';
import type CityEntity from './typings/models/CityEntity';
import { getStorage } from './helpers/getStorage';
import makeCityId from './helpers/makeCityId';
import getCurrentPosition from './helpers/getCurrentPosition';

const props = defineProps<{
  apiKey: string;
}>();

provide('apiKey', props.apiKey);

const STORAGE_KEY = 'weatherWidget';
const cityStorage = getStorage<CityEntity[]>(STORAGE_KEY);
const cityFromStorage = cityStorage.get({ isStringify: true }) ?? [];

const cities = ref(cityFromStorage);

// if cities is empty try to get current user position
if (!cities.value.length) {
  getCurrentPosition(pos => {
    const { coords } = pos;
    cities.value.push({
      id: makeCityId(coords.latitude, coords.longitude),
      name: '',
      country: '',
      lat: coords.latitude,
      lon: coords.longitude,
      currentPos: true
    });
  });
}

// save cities to storage
watch(
  cities,
  () => {
    cityStorage.save(cities.value);
  },
  { deep: true }
);

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

  cities.value.push(city);
};

const onUpdateCity = (city: CityEntity): void => {
  const foundCity = cities.value.find(c => c.id === city.id);

  if (foundCity) {
    foundCity.name = city.name;
    foundCity.country = city.country;
  }
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
      v-if="!cities.length"
      :class="styles.message">
      Click on <SettingsIcon :class="styles.messageIcon" /> to add a city!
    </div>

    <CityPanel
      v-for="city in cities"
      :key="city.id"
      :city="city"
      @update-city="onUpdateCity" />

    <ModalUi
      v-if="isSettingsOpened"
      @closeModal="isSettingsOpened = false">
      <SettingsModal
        :cities="cities"
        @reorderCities="reorderCitiesHandler"
        @remove-city="onRemoveCity"
        @add-city="onAddCity" />
    </ModalUi>
  </div>
</template>

<style module="styles" lang="scss">
@import '@/styles/mixins.scss';

.widgetContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 50px;
  width: 260px;
  min-height: var(--widget-min-height);
  padding: 20px;
  border-radius: var(--border-radius);
  background-color: var(--white);
  box-shadow: 2px 2px 5px 2px var(--shadow);
}

.settingsBtn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;

  &:hover {
    svg {
      transform: rotate(45deg);
    }
  }

  svg {
    transition: 0.5s;
  }
}

.message {
  @include absolute-center;
  text-align: center;
  font-size: 18px;

  &Icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
}
</style>
