<script setup lang="ts">
import Button from 'primevue/button'
import { onMounted, onUnmounted, ref } from 'vue'
import CreateModal from '@/components/CreateModal.vue'
import type { FilterRules, Task } from '@/types.ts'
import { useTasksStore } from '@/stores/tasks.ts'
import { storeToRefs } from 'pinia'
import TaskList from '@/components/TaskList.vue'
import FilterModal from '@/components/FilterModal.vue'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import PriorityChart from '@/components/charts/PriorityChart.vue'
import TagsChart from '@/components/charts/TagsChart.vue'

const tasksStore = useTasksStore()
const { tags, filterRules, visibleTasks, tasks, isShowStatistics } = storeToRefs(tasksStore)
const { hasDuplicate, addTask, removeTask, initState, saveData } = tasksStore

const hasDuplicateError = ref(false)
const isVisibleCreateModal = ref(false)
const isVisibleFilterModal = ref(false)
const savedTimerId = ref<number | null>(null)

const createTask = (newTask: Omit<Task, 'id' | 'isDone'>) => {
  hasDuplicateError.value = hasDuplicate(newTask)
  if (!hasDuplicateError.value) {
    addTask(newTask)
    isVisibleCreateModal.value = false
  }
}

const applyFilter = (
  newFilters: Omit<FilterRules, 'searchNameString' | 'searchDescriptionString'>,
) => {
  filterRules.value = {
    ...newFilters,
    searchNameString: filterRules.value.searchNameString,
    searchDescriptionString: filterRules.value.searchDescriptionString,
  }
  isVisibleFilterModal.value = false
}

onMounted(() => {
  initState()
  savedTimerId.value = window.setInterval(saveData, 10000)
})
onUnmounted(() => {
  if (savedTimerId.value !== null) {
    window.clearInterval(savedTimerId.value)
    savedTimerId.value = null
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-2">
      <Button
        :pt="{
          root: ['p-2 w-40'],
        }"
        label="Добавить"
        @click="isVisibleCreateModal = true"
      ></Button>
      <Button
        :pt="{
          root: ['p-2 bg-blue-500'],
        }"
        severity="info"
        label="Настроить фильтрацию"
        @click="isVisibleFilterModal = true"
      ></Button>
      <Button
        v-if="tasks.length > 0"
        :pt="{ root: ['p-2'] }"
        :label="isShowStatistics ? 'Скрыть статистику' : 'Показать статистику'"
        @click="isShowStatistics = !isShowStatistics"
      />
    </div>
    <div class="flex gap-2 items-center">
      <FloatLabel variant="in">
        <InputText id="name" name="name" class="w-full" v-model="filterRules.searchNameString" />
        <label for="name">Название задачи</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText
          id="name"
          name="name"
          class="w-full"
          v-model="filterRules.searchDescriptionString"
        />
        <label for="name">Описание задачи</label>
      </FloatLabel>
    </div>
    <CreateModal
      v-if="isVisibleCreateModal"
      @close="isVisibleCreateModal = false"
      @create="createTask"
      v-model:hasDuplicateError="hasDuplicateError"
    />
    <FilterModal
      v-model:visible="isVisibleFilterModal"
      @apply="applyFilter"
      :tags="tags"
      :filterRules="filterRules"
    />
    <TaskList :tasks="visibleTasks" @remove="(id) => removeTask(id)" />
    <div v-if="tasks.length > 0 && isShowStatistics" class="flex flex-col gap-4">
      <PriorityChart />
      <TagsChart />
    </div>
  </div>
</template>

<style scoped></style>
