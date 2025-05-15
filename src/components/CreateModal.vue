<script setup lang="ts">
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import DatePicker from 'primevue/datepicker'
import AutoComplete from 'primevue/autocomplete'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import { Form } from '@primevue/forms'
import Message from 'primevue/message'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { PriorityThemesMap, PriorityLabelMap, type Task } from '@/types.ts'
import { ref } from 'vue'
import { taskValidationSchema } from '@/models/taskValidation.ts'
import { priorityList } from '@/models/selectOptions.ts'

const hasDuplicateError = defineModel<boolean>('hasDuplicateError', { required: true })
const emit = defineEmits<{ close: []; create: [Omit<Task, 'id' | 'isDone'>] }>()
const resolver = zodResolver(taskValidationSchema)
const initialValues = ref<Omit<Task, 'id' | 'isDone'>>({
  name: '',
  description: '',
  deadline: null,
  tags: [],
  priority: null,
})

const onFormSubmit = ({ valid, values }: { valid: boolean; values: Record<string, any> }) => {
  if (valid) {
    emit('create', values)
  }
}

const onTagToggle = ($form: any, e: { value: string[] }) => {
  const newTag = e.value[e.value.length - 1]
  if (!newTag) return
  const current = new Set($form.tags.value)
  if (current.has(newTag)) {
    current.delete(newTag)
  } else {
    current.add(newTag)
  }
  $form.tags.value = [...new Set(e.value)]
}
</script>

<template>
  <Dialog
    v-on:keyup.esc="
      () => {
        emit('close')
      }
    "
    :visible="true"
    modal
    header="Новая задача"
    class="min-w-[300px] max-w-[500px] w-full"
    :closable="false"
    :pt="{
      root: ['mx-5'],
      header: ['!flex !items-center !justify-center !text-center'],
    }"
  >
    <Form
      v-slot="$form"
      :initialValues
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-2 w-full"
      @keydown.enter.prevent
    >
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputText
            id="name"
            name="name"
            class="w-full"
            @update:model-value="hasDuplicateError = false"
          />
          <label for="name">Название<span class="text-red-500">*</span></label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple"
          >{{ $form.name.error.message }}
        </Message>
      </div>
      <FloatLabel variant="in">
        <Textarea
          id="description"
          name="description"
          autoResize
          rows="2"
          cols="30"
          class="w-full"
        />
        <label for="description">Описание</label>
      </FloatLabel>
      <FloatLabel variant="in" :pt="{ root: ['-mt-2'] }">
        <DatePicker
          id="datepicker-24h"
          inputId="deadline"
          name="deadline"
          hourFormat="24"
          fluid
          :manualInput="false"
          variant="filled"
          @update:model-value="hasDuplicateError = false"
        />
        <label for="deadline">Срок выполнения</label>
      </FloatLabel>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in" :pt="{ root: ['!w-full'] }">
          <AutoComplete
            id="tags"
            name="tags"
            multiple
            :typeahead="false"
            @change="(e) => onTagToggle($form, e)"
            :pt="{ root: ['!w-full'] }"
          />
          <label for="tags">Теги<span class="text-red-500">*</span></label>
        </FloatLabel>
        <Message v-if="$form.tags?.invalid" severity="error" size="small" variant="simple"
          >{{ $form.tags.error.message }}
        </Message>
      </div>
      <FloatLabel variant="in">
        <Dropdown
          name="priority"
          inputId="priority"
          :options="priorityList"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        >
          <template #option="{ option }">
            <Tag :severity="option.theme" :value="option.label" />
          </template>
          <template #value="{ value }">
            <Tag
              v-if="value"
              :value="PriorityLabelMap[value]"
              :severity="PriorityThemesMap[value]"
            />
          </template>
        </Dropdown>
        <label for="priority">Приоритет</label>
      </FloatLabel>
      <Message v-if="hasDuplicateError" severity="error" size="small" variant="simple">
        Уже существует такое значение - Название + Срок выполнения
      </Message>
      <div class="flex justify-between items-center gap-4 !mt-4">
        <Button
          label="Отменить"
          severity="secondary"
          class="grow-1"
          @click="emit('close')"
        ></Button>
        <Button label="Сохранить" type="submit" class="grow-1"></Button>
      </div>
    </Form>
  </Dialog>
</template>

<style></style>
