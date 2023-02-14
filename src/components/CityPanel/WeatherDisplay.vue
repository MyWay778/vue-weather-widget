<script setup lang="ts">
import type CityWeatherEntity from '@/typings/models/CityWeatherEntity';
import CelsiusUnitValue from '@UI/CelsiusUnitValue.vue';
import CompassIcon from '../icons/CompassIcon.vue';
import TitleUi from '@UI/TitleUi.vue';
import WindArrow from '@UI/WindArrow.vue';
import GeoIcon from '../icons/GeoIcon.vue';

// eslint-disable-next-line vue/no-setup-props-destructure
const { weather, currentPosition } = defineProps<{
  weather: CityWeatherEntity;
  currentPosition?: boolean;
}>();
</script>

<template>
  <div :class="styles.header">
    <TitleUi :class="styles.title"
      >{{ weather.name }}, {{ weather.country }}
      <GeoIcon
        v-if="currentPosition"
        :class="styles.geoIcon"
        width="16"
        height="16"
    /></TitleUi>
  </div>

  <div :class="styles.tempBlock">
    <div :class="styles.image">
      <img
        :src="weather.iconUrl"
        :atl="weather.main" />
    </div>
    <div :class="styles.value">
      <CelsiusUnitValue :value="weather.temp" />
    </div>
  </div>

  <div :class="styles.infoBlock">
    <div :class="styles.description">
      Feels like <CelsiusUnitValue :value="weather.feelsLike" />. {{ weather.description }}.
    </div>

    <div :class="styles.entries">
      <div :class="[styles.entry, styles.entry_withIcon]">
        <WindArrow :deg="weather.windDeg" />
        <span> {{ weather.windSpeed }}m/s {{ weather.windDir }}</span>
      </div>

      <div :class="[styles.entry, styles.entry_withIcon]">
        <CompassIcon />
        <span> {{ weather.pressure }}hPa</span>
      </div>

      <div :class="styles.entry">
        <span :class="styles.entryTitle">Humidity: </span>
        <span>{{ weather.humidity }}%</span>
      </div>

      <div :class="styles.entry">
        <span :class="styles.entryTitle">Visibility: </span>
        <span>{{ weather.visibility }}km</span>
      </div>

      <div
        v-if="weather.seaLevel"
        :class="styles.entry">
        <span :class="styles.entryTitle">Sea level: </span>
        <span>{{ weather.seaLevel }}km</span>
      </div>
    </div>
  </div>
</template>

<style module="styles" lang="scss">
@import '@/styles/mixins.scss';

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    @include text-overflow;
    padding-right: 20px;
    position: relative;
    max-width: 80%;
  }

  .geoIcon {
    position: absolute;
    right: 0;
  }
}

.tempBlock {
  display: flex;
  align-items: center;
  height: 80px;
  margin-top: 15px;

  .image {
    width: 50%;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .value {
    width: 50%;
    font-size: 34px;
    text-align: center;

    .units {
      vertical-align: top;
      font-size: 18px;
    }
  }
}

.infoBlock {
  font-size: 14px;
  margin-top: 15px;
}

.entries {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 10px;
  margin-top: 15px;
}

.entry {
  min-width: 50%;

  &_withIcon {
    display: flex;
    align-items: center;
    column-gap: 5px;
  }

  .entryTitle {
    font-weight: 600;
  }
}
</style>
