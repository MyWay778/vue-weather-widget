<script setup lang="ts">
  import { CelsiusUnitValue, TitleUi, WindArrow, CompassIcon, GeoIcon } from '@/components/shared'
  import type { Weather } from '@/entities/weather'

  const { weather, currentPosition } = defineProps<{
    weather: Weather
    currentPosition?: boolean
  }>()
</script>

<template>
  <div class="header">
    <TitleUi class="title u-text-overflow"
      >{{ weather.name }}, {{ weather.country }}
      <GeoIcon
        v-if="currentPosition"
        class="geo-icon"
        width="16"
        height="16"
    /></TitleUi>
  </div>

  <div class="temp-block">
    <div class="image">
      <img
        :src="weather.iconUrl"
        :atl="weather.main" />
    </div>
    <div class="value">
      <CelsiusUnitValue :value="weather.temp" />
    </div>
  </div>

  <div class="info-block">
    <div class="description">
      Feels like <CelsiusUnitValue :value="weather.feelsLike" />. {{ weather.description }}.
    </div>

    <div class="entries">
      <div class="entry _with-icon">
        <WindArrow :deg="weather.windDeg" />
        <span> {{ weather.windSpeed }}m/s {{ weather.windDir }}</span>
      </div>

      <div class="entry _with-icon">
        <CompassIcon />
        <span> {{ weather.pressure }}hPa</span>
      </div>

      <div class="entry">
        <span class="entry-title">Humidity: </span>
        <span>{{ weather.humidity }}%</span>
      </div>

      <div class="entry">
        <span class="entry-title">Visibility: </span>
        <span>{{ weather.visibility }}km</span>
      </div>

      <div
        v-if="weather.seaLevel"
        class="entry">
        <span class="entry-title">Sea level: </span>
        <span>{{ weather.seaLevel }}km</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      padding-right: 20px;
      position: relative;
      max-width: 80%;
    }

    .geo-icon {
      position: absolute;
      right: 0;
    }
  }

  .temp-block {
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

  .info-block {
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

    &._with-icon {
      display: flex;
      align-items: center;
      column-gap: 5px;
    }

    .entry-title {
      font-weight: 600;
    }
  }
</style>
