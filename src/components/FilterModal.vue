<script setup lang="ts">
import Drawer from 'primevue/drawer'
import MultiSelect from 'primevue/multiselect'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import { type FilterRules, PriorityLabelMap, PriorityThemesMap } from '@/types.ts'
import { ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import { periodExecutionList, priorityList } from '@/models/selectOptions.ts'

type FilterWithoutSearchStrings = Omit<FilterRules, 'searchNameString' | 'searchDescriptionString'>
const emit = defineEmits<{ close: []; apply: [FilterWithoutSearchStrings] }>()
const visible = defineModel<boolean>('visible', { required: true })
const props = defineProps<{ filterRules: FilterRules; tags: string[] }>()
const selectedTags = ref(props.filterRules.tags)
const priority = ref(props.filterRules.priority)
const periodExecution = ref(props.filterRules.periodExecution)

const apply = () => {
  const filterRules = {
    tags: selectedTags.value ?? [],
    periodExecution: periodExecution.value ?? null,
    priority: priority.value ?? null,
  } satisfies FilterWithoutSearchStrings
  emit('apply', filterRules)
}

const resetFilters = () => {
  selectedTags.value = props.filterRules.tags
  priority.value = props.filterRules.priority
  periodExecution.value = props.filterRules.periodExecution
}
watch(
  () => props,
  (newValue) => {
    selectedTags.value = newValue.filterRules.tags
    priority.value = newValue.filterRules.priority
    periodExecution.value = newValue.filterRules.periodExecution
  },
  { deep: true },
)
</script>

<template>
  <Drawer
    v-model:visible="visible"
    :dismissable="false"
    header="Правила фильтрации"
    position="right"
    :pt="{
      root: ['!w-[90%] md:!w-full max-w-[700px]'],
      header: [''],
      title: [' whitespace-nowrap mr-4 '],
    }"
  >
    <template #header>
      <div class="flex gap-2 items-center justify-between w-full">
        <h2 class="text-lg md:!text-2xl font-semibold">Правила фильтрации</h2>
        <Button label="Применить" class="mr-5 shrink-0 !px-2 !py-2" @click="apply"></Button>
      </div>
    </template>
    <template #closebutton="{ closeCallback }">
      <i
        tabindex="0"
        v-on:keyup.enter="
          () => {
            resetFilters()
            closeCallback()
          }
        "
        style="font-size: 1.5rem"
        class="pi pi-times cursor-pointer"
        @click="
          () => {
            resetFilters()
            closeCallback()
          }
        "
      ></i>
    </template>
    <div class="flex flex-col gap-4">
      <FloatLabel class="w-full" variant="in">
        <MultiSelect
          id="selection_tags"
          v-model="selectedTags"
          :options="tags"
          variant="filled"
          class="w-full"
          showClear
          :pt="{ label: '!truncate', labelContainer: '!truncate' }"
        />
        <label for="selection_tags">Выберите теги</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Dropdown
          name="priority"
          v-model="priority"
          inputId="priority"
          :options="priorityList"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          showClear
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
      <FloatLabel variant="in">
        <Dropdown
          name="priority"
          v-model="periodExecution"
          inputId="priority"
          :options="periodExecutionList"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          showClear
        />
        <label for="priority">Срок выполнения</label>
      </FloatLabel>
    </div>
  </Drawer>
</template>

<style scoped></style>
