<script setup lang="ts">
  import type { City } from '@/entities/city'
  import { onMounted, ref, useTemplateRef, watch } from 'vue'
  import { draggableList, swapArrayItems } from '@/helpers'
  import { HamburgerIcon, IconButton, TrashIcon } from '@/components/shared'

  const citiesModel = defineModel<City[]>('cities', { required: true })

  const listRef = useTemplateRef<HTMLElement>('list')
  const itemsRef = useTemplateRef<HTMLElement[]>('items')

  const activeIndex = ref(-1)
  let draggable: ReturnType<typeof draggableList> | null = null

  onMounted(() => {
    if (listRef.value && itemsRef.value) {
      draggable = draggableList(listRef.value, itemsRef.value, onItemPositionChanged)
    }
  })

  // When cities length change - need to update draggable state
  watch(
    citiesModel,
    (value, oldValue) => {
      if (value.length !== oldValue.length) {
        draggable?.update()
      }
    },
    { flush: 'post' } // draggable needs updated DOM elements to update state
  )

  const onItemPositionChanged = (oldIndex: number, newIndex: number): void => {
    activeIndex.value = newIndex
    citiesModel.value = swapArrayItems(citiesModel.value, oldIndex, newIndex)
  }

  const onDragStart = (event: MouseEvent, index: number) => {
    if (draggable) {
      activeIndex.value = index
      draggable.onDragStart(event, index)
    }
  }

  const onDragEnd = () => {
    if (draggable) {
      activeIndex.value = -1
      draggable.onDragEnd()
    }
  }

  const onRemoveCity = (cityId: string): void => {
    citiesModel.value = citiesModel.value.filter(city => city.id !== cityId)
  }
</script>

<template>
  <ul
    class="city-list"
    ref="list">
    <li
      v-for="(city, index) in citiesModel"
      :key="city.id"
      class="item-container">
      <div
        class="city-item"
        :class="{ draggable: activeIndex === index }"
        @mouseup="onDragEnd()"
        ref="items">
        <div
          class="hamburger"
          @mousedown="onDragStart($event, index)">
          <HamburgerIcon />
        </div>

        <span class="city-name u-text-overflow">{{ city.name }}, {{ city.country }}</span>

        <IconButton
          class="city-item-trash-icon"
          @click="onRemoveCity(city.id)">
          <TrashIcon />
        </IconButton>
      </div>
    </li>
  </ul>
</template>

<style scoped>
  .city-list {
    position: relative;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }

  .item-container {
    border: 1px solid var(--gray-light);
  }

  .city-item {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    padding: 6px 5px;
    column-gap: 5px;
    background-color: var(--gray-light);

    &.draggable {
      z-index: 1;
      box-shadow: 2px 2px 4px 1px var(--shadow);
      cursor: grabbing;

      .hamburger {
        cursor: inherit;
      }
    }
  }

  .city-item-trash-icon {
    margin-left: auto;
    flex-shrink: 0;
  }

  .hamburger {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: grab;
  }

  .city-name {
    user-select: none;
  }
</style>
