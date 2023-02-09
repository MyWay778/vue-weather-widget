<script setup lang="ts">
import type CityEntity from '@/typings/CityEntity';
import { nextTick, onMounted, ref, watch } from 'vue';
import HamburgerIcon from '../icons/HamburgerIcon.vue';
import TrashIcon from '../icons/TrashIcon.vue';

const props = defineProps<{ cities: CityEntity[] }>();

const localCities: any = ref(props.cities);

const list = ref(null);
const items: any = ref(null);
const target1 = ref(null);

let initialX = 0;
let initialY = 0;

let listReact = null;

let activeEl = null;
let activeIndex = -1;

const coords = {};

onMounted(() => {
  localCities.value.forEach((city, index) => {
    // city.rect = items.value[index].getBoundingClientRect();
    city.el = items.value[index];
  });

  listReact = list.value.getBoundingClientRect();
});

const dragStartHandler = (event: Event, index) => {
  initialX = event.x;
  initialY = event.y;

  activeEl = localCities.value[index].el;
  activeEl.style.zIndex = '1';
  activeIndex = index;

  window.addEventListener('mousemove', dragHandler);
};

const dragHandler = (event: Event) => {
  const x = event.x - initialX;
  const y = event.y - initialY;

  activeEl.style.transform = `translate(${x}px, ${y}px)`;

  const activeRect = activeEl.getBoundingClientRect();

  localCities.value.forEach((targetCity, targetIndex) => {
    if (targetCity.el === activeEl) return;

    const targetRect = targetCity.el.getBoundingClientRect();

    if (activeIndex < targetIndex && targetRect.top < activeRect.top && targetRect.bottom < activeRect.bottom) {
      const localCitiesCopy = [...localCities.value];

      const activeCity = localCitiesCopy[activeIndex];
      localCitiesCopy[activeIndex] = localCitiesCopy[targetIndex];
      localCitiesCopy[targetIndex] = activeCity;

      localCities.value = localCitiesCopy;

      activeIndex = targetIndex;

      const activeCursorXOffset = event.x - activeRect.x;
      const newTranslateX = event.x - targetRect.x - activeCursorXOffset;

      const activeCursorYOffset = event.y - activeRect.y;
      const newTranslateY = event.y - targetRect.y - activeCursorYOffset;
      console.log('ACY:', activeCursorYOffset);
      console.log('nTY:', newTranslateY);
      initialX = event.x - newTranslateX;
      initialY = event.y - newTranslateY;
      activeEl.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
    } else if (activeIndex > targetIndex && targetRect.top > activeRect.top && targetRect.bottom > activeRect.bottom) {
      const localCitiesCopy = [...localCities.value];
      const activeCity = localCitiesCopy[activeIndex];
      localCitiesCopy[activeIndex] = localCitiesCopy[targetIndex];
      localCitiesCopy[targetIndex] = activeCity;

      localCities.value = localCitiesCopy;

      activeIndex = targetIndex;

      initialX = event.x;
      initialY = event.y;
      activeEl.style.transform = `translate(${0}px, ${0}px)`;
    }
  });

  if (listReact.left > event.x || listReact.top > event.y || listReact.right < event.x || listReact.bottom < event.y) {
    dragEndHandler(event);
  }
};

const dragEndHandler = (event: Event) => {
  if (!activeEl) return;
  activeEl.style.zIndex = '';
  activeEl.style.transform = '';

  initialX = 0;
  initialY = 0;

  window.removeEventListener('mousemove', dragHandler);

  activeEl = null;
};

const dragOverHandler = (event: Event) => {
  console.log('mouseEnter:', event);
};
</script>

<template>
  <ul
    :class="styles.cityList"
    ref="list">
    <li
      v-for="(city, index) in localCities"
      :key="city.id"
      :class="styles.itemContainer">
      <div
        :class="styles.cityItem"
        ref="items">
        <div
          :class="styles.hamburger"
          @mousedown="dragStartHandler($event, index)"
          @mouseup="dragEndHandler">
          <HamburgerIcon />
        </div>
        <span :class="styles.cityName">{{ city.name }}, {{ city.country }}</span>
        <TrashIcon :class="styles.cityItemTrash" />
      </div>
    </li>
  </ul>
</template>

<style module="styles" lang="scss">
.cityList {
  position: relative;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.itemContainer {
  border: 1px solid var(--gray-light);
}

.cityItem {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 6px 5px;
  column-gap: 5px;
  background-color: var(--gray-light);

  &Trash {
    margin-left: auto;
  }
}

.hamburger {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.cityName {
  user-select: none;
}

.dragTarget {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}
</style>
