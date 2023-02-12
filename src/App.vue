<script setup lang="ts">
import SettingsIcon from './components/icons/SettingIcon.vue';
import ButtonWIthIcon from './components/UI/ButtonWIthIcon.vue';
import CityPanel from './components/CityPanel/CityPanel.vue';
import ModalUi from './components/UI/ModalUi.vue';
import SettingsModal from './components/SettingsModal/SettingsModal.vue';
import { ref } from 'vue';
import type CityEntity from './typings/models/CityEntity';

const cities = ref<CityEntity[]>([
  // {
  //   id: 8890,
  //   name: 'Chita',
  //   country: 'RU',
  //   lat: 51.5085,
  //   lon: -0.1257
  // },
  {
    id: '2075535',
    name: 'London',
    country: 'GB',
    lat: 51.5085,
    lon: -0.1257
  },
  {
    id: '2018597',
    name: 'Moscow',
    country: 'Ru',
    lat: 51.5085,
    lon: -0.1257
  }
]);

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
      v-if="!cities.length"
      :class="styles.message">
      Click on <SettingsIcon :class="styles.messageIcon" /> to add a city!
    </div>

    <CityPanel
      v-for="city in cities"
      :key="city.id"
      :city="city" />

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
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  font-size: 18px;
  transform: translate(-50%, -50%);

  &Icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
}
</style>
