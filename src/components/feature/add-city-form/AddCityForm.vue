<script setup lang="ts">
import { computed, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { TitleUi } from '@/components/ui/'
import { InputWithOptions } from '@/components/settings/addCityForm'
import { useFetchCityOptions } from '@/composables/'
import type CityEntity from '@/typings/models/CityEntity'
import type { City } from '@/entities/city/types'
import { IconButton, ArrowLeftIcon } from '@/components/shared'

const emit = defineEmits<{
  'add-city': [city: City]
}>()

const inputValue = ref('')
const selectedOption = shallowRef<CityEntity | null>(null)
const enableRequest = ref(true) // Need to disable request, when set selected option value to input
const message = ref('')
const isSubmitDisabled = computed(() => !selectedOption.value)
const inputWithOptionsRef = useTemplateRef<InstanceType<typeof InputWithOptions>>('input-with-options') // a reference to the inputWithOptions component

const { options, isError, isLoading } = useFetchCityOptions(inputValue, enableRequest, 600)

// Error handling
watch(isError, value => {
  if (value) {
    showMessage('error')
  }
})

// City not found handling
// show message if searched city is not found, set watcher to loading state and wait for options value change
watch(isLoading, value => {
  if (value) {
    watchThatOptionsIsEmpty()
  }
})

function watchThatOptionsIsEmpty() {
  watch(
    options,
    value => {
      if (value.length === 0) {
        showMessage('not-found')
      }
    },
    { once: true }
  )
}

function updateInputValueHandler() {
  hideMessage()
  selectedOption.value = null
  enableRequest.value = true
}

const addCity = () => {
  if (!selectedOption.value) return

  emit('add-city', selectedOption.value)
  inputValue.value = ''
}

function showMessage(messageType: 'not-found' | 'empty-input' | 'error') {
  if (messageType === 'not-found') {
    message.value = 'City not found!'
  } else if (messageType === 'empty-input') {
    message.value = 'Enter the name of the city, for example "Moscow"'
  } else if (messageType === 'error') {
    message.value = 'Request failed. Try again.'
  } else {
    hideMessage()
  }
}

function hideMessage() {
  message.value = ''
}

function onSubmit() {
  if (!inputValue.value) {
    showMessage('empty-input')
    return
  }

  if (selectedOption.value) {
    addCity()
  } else {
    // if there are options - focus on the input field to show these options
    if (options.value.length) {
      setTimeout(() => {
        inputWithOptionsRef.value?.focusInput()
      }, 100)
    }
  }
}

const selectOptionHandler = (option: CityEntity): void => {
  selectedOption.value = option

  // prevent request with selected option value
  enableRequest.value = false
  // set the selected option in the input field
  inputValue.value = `${option.name}, ${option.country}`

  inputWithOptionsRef.value?.blurInput()
}

const onEnterDown = () => {
  if (selectedOption.value) {
    addCity()
  }
}
</script>

<template>
  <form
    class="add-city-form"
    @submit.prevent>
    <TitleUi>Add Location:</TitleUi>

    <div class="city-name">
      <InputWithOptions
        v-model="inputValue"
        name="city-name"
        @update:model-value="updateInputValueHandler"
        :options="options"
        @select-option="selectOptionHandler"
        @enter-down="onEnterDown"
        ref="input-with-options"
        inputType="search"
        placeholder="Enter city name..." />

      <IconButton
        class="arrow-btn"
        :class="{ _disabled: isSubmitDisabled }"
        @click="onSubmit">
        <ArrowLeftIcon />
      </IconButton>
    </div>

    <div
      v-show="message && !options.length"
      class="message">
      {{ message }}
    </div>
  </form>
</template>

<style scoped>
.add-city-form {
  margin-top: 40px;

  .city-name {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 5px;
    margin-top: 8px;
  }
}

.arrow-btn {
  flex-shrink: 0;
  width: 25px;
  height: 25px;

  &._disabled {
    opacity: 0.5;

    &:hover {
      color: inherit;
      cursor: default;
    }
  }
}

.message {
  margin-top: 15px;
}
</style>
