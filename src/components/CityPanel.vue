<script setup lang="ts">
import type CityWeatherEntity from '@/typings/CityWeatherEntity';
import CelsiusUnitValue from './CelsiusUnitValue.vue';
import CompassIcon from './icons/CompassIcon.vue';
import TitleUi from './UI/TitleUi.vue';
import WindArrow from './WindArrow.vue';

interface CityPanelProps {
  data: CityWeatherEntity;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const { data } = defineProps<CityPanelProps>();
</script>

<template>
  <section>
    <div :class="styles.header">
      <TitleUi>{{ data.name }}, {{ data.country }}</TitleUi>
    </div>

    <div :class="styles.tempBlock">
      <div :class="styles.image">
        <img
          :src="data.iconUrl"
          :atl="data.main" />
      </div>
      <div :class="styles.value">
        <span>{{ data.temp }}</span>
        <sup :class="styles.units">o</sup>
        <span>C</span>
      </div>
    </div>

    <div :class="styles.infoBlock">
      <div :class="styles.description">
        Feels like <CelsiusUnitValue :value="data.feelsLike" />. {{ data.description }}.
      </div>

      <div :class="styles.entries">
        <div :class="[styles.entry, styles.entry_withIcon]">
          <WindArrow :deg="data.windDeg" />
          <span> {{ data.windSpeed }}m/s {{ data.windDir }}</span>
        </div>

        <div :class="[styles.entry, styles.entry_withIcon]">
          <CompassIcon />
          <span> {{ data.pressure }}hPa</span>
        </div>

        <div :class="styles.entry">
          <span :class="styles.entryTitle">Humidity: </span>
          <span>{{ data.humidity }}%</span>
        </div>

        <div
          v-if="data.seaLevel"
          :class="styles.entry">
          <span :class="styles.entryTitle">Sea level: </span>
          <span>{{ data.seaLevel }}km</span>
        </div>

        <div :class="styles.entry">
          <span :class="styles.entryTitle">Visibility: </span>
          <span>{{ data.visibility }}km</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style module="styles" lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
