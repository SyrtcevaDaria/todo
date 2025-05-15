<script setup lang="ts">
import { PriorityLabelMap, PriorityThemesMap, type Task } from '@/types.ts'
import Checkbox from 'primevue/checkbox'
import { computed, ref } from 'vue'
import Panel from 'primevue/panel'
import Tag from 'primevue/tag'
import { formatDateWithDetails, getStartDay } from '@/utils/formatDate.ts'

const task = defineModel<Task>('task', { required: true })
defineEmits<{ remove: [] }>()
const isOverdue = computed(
  () =>
    !task.value.isDone &&
    task.value.deadline &&
    getStartDay(new Date(task.value.deadline)) < getStartDay(new Date()),
)
const formatedDate = computed(() =>
  task.value?.deadline ? formatDateWithDetails(task.value?.deadline) : null,
)
const isClosePanel = ref(true)
</script>

<template>
  <Panel
    toggleable
    v-model:collapsed="isClosePanel"
    class="rounded-lg p-4 !border !min-w-[18rem] shadow-sm"
    :class="isOverdue ? '!border-red-500 !bg-red-50' : '!border-gray-800 !bg-white'"
    :pt="{
      root: ['!p-0'],
      headerActions: ['!w-7'],
    }"
  >
    <template #header>
      <div class="flex justify-between items-center gap-2 w-full">
        <div class="flex items-center gap-2">
          <Checkbox v-model="task.isDone" binary />
          <span class="!font-semibold !mr-2" :class="task.isDone ? 'line-through' : ''">{{
            task.name
          }}</span>
        </div>
        <Tag
          class="ml-auto"
          v-if="task.priority"
          :value="PriorityLabelMap[task.priority]"
          :severity="PriorityThemesMap[task.priority]"
        />
      </div>
    </template>
    <div class="m-0 flex flex-col gap-2">
      <p>{{ task.description }}</p>
      <div class="flex gap-2 flex-wrap" v-if="task.tags.length > 0">
        <div
          class="inline-block py-1 px-3 text-sm font-semibold bg-gray-200 rounded-full"
          v-for="(tag, id) in task.tags"
          :key="id"
        >
          {{ tag }}
        </div>
      </div>
      <div class="flex justify-between items-center !mt-auto cursor-pointer !min-h-7">
        <p v-if="formatedDate && !task.isDone">{{ formatedDate }}</p>
        <i
          class="pi pi-trash !ml-auto"
          :style="{ color: 'red', fontSize: '1.3rem' }"
          @click="$emit('remove')"
        />
      </div>
    </div>
  </Panel>
</template>

<style scoped></style>
