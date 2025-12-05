<script setup lang="ts">
  import { useTemplateRef } from 'vue'

  const model = defineModel<string>({ required: true })

  const props = withDefaults(
    defineProps<{
      name: string
      type: string
      placeholder: string
      disabled?: boolean
    }>(),
    {
      type: 'text',
      placeholder: '',
      disabled: false
    }
  )

  const inputEl = useTemplateRef<HTMLInputElement>('input')

  // Expose
  function focusInput() {
    if (!inputEl.value) return
    inputEl.value.focus()
  }

  function blurInput() {
    if (!inputEl.value) return
    inputEl.value.blur()
  }

  defineExpose({
    focusInput,
    blurInput
  })
</script>

<template>
  <input
    v-model="model"
    class="input"
    :name="props.name"
    :type="props.type"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    ref="input" />
</template>

<style scoped>
  .input {
    width: 100%;
    height: 35px;
    padding-left: 8px;
    font-size: 16px;
    color: var(--black);
    outline-color: var(--active);
  }
</style>
