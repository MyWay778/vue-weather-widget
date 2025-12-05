<script setup lang="ts">
  import { computed, ref, useTemplateRef } from 'vue'
  import { InputUi, type InputOption } from '@/components/shared'
  import { sanitizeInput, excludedChars } from '@/helpers'

  const model = defineModel<string>({ required: true })

  const props = defineProps<{
    inputType: string
    placeholder: string
    options: InputOption[]
    name: string
  }>()

  const emit = defineEmits<{
    'select-option': [value: InputOption]
    'enter-down': []
  }>()

  // internal flag to show or not options
  const isNeedToClose = ref(false)
  const isShowOptions = computed(() => Boolean(!isNeedToClose.value && props.options.length))

  // Update Model Handler
  const onUpdateModelValue = (value: string) => {
    const saveText = sanitizeInput(value, excludedChars.cityInput)
    model.value = saveText
  }

  const onOptionClick = (option: InputOption) => {
    emit('select-option', option)
  }

  // hide options when blur occurs,
  // timeout to give time to propagate option click event
  const blurHandler = () => {
    setTimeout(() => {
      isNeedToClose.value = true
    }, 100)
  }

  // Input Focus
  const onInputFocus = () => {
    isNeedToClose.value = false
  }

  // Expose
  // get a reference to the inputUi component to expose the focus method
  const inputUiRef = useTemplateRef<InstanceType<typeof InputUi>>('input-ui')
  function focusInput() {
    if (!inputUiRef.value) return
    inputUiRef.value.focusInput()
  }
  function blurInput() {
    if (!inputUiRef.value) return
    inputUiRef.value.blurInput()
  }

  defineExpose({
    focusInput,
    blurInput
  })
</script>

<template>
  <div
    class="container"
    @click.stop>
    <InputUi
      :model-value="modelValue"
      :type="inputType"
      :placeholder="placeholder"
      :name="props.name"
      @click.stop
      @update:modelValue="onUpdateModelValue"
      @focus="onInputFocus"
      @keydown.enter="emit('enter-down')"
      @blur="blurHandler"
      ref="input-ui"
      autocomplete="off" />

    <ul
      v-show="isShowOptions"
      class="suggestions">
      <button
        v-for="option in options"
        :key="option.value"
        class="button c-button"
        @click="onOptionClick(option)"
        type="button">
        {{ option.label }}
      </button>
    </ul>
  </div>
</template>

<style scoped>
  .container {
    position: relative;
  }

  .suggestions {
    position: absolute;
    left: 0;
    top: 115%;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-block: 5px;
    max-height: 100px;
    background-color: var(--white);
    border: 1px solid var(--gray-light);
    overflow: hidden scroll;
    scrollbar-width: thin;
    scrollbar-gutter: stable;

    &::-webkit-scrollbar {
      width: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #8cc7ff;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 10px;
    }
  }

  .button {
    padding: 5px 10px;
    text-align: left;
  }
</style>
