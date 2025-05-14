<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import CreateModal from '@/components/CreateModal.vue'
import type { Task } from '@/types.ts'
import { useTasksStore } from '@/stores/tasks.ts'
import { storeToRefs } from 'pinia'
import TaskList from '@/components/TaskList.vue'
const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const { hasDuplicate, addTask } = tasksStore

const hasDuplicateError = ref(false)
const isVisibleCreateModal = ref(false)

const createTask = (newTask: Omit<Task, 'id' | 'isDone'>) => {
  hasDuplicateError.value = hasDuplicate(newTask)
  if (!hasDuplicateError.value) {
    addTask(newTask)
    isVisibleCreateModal.value = false
  }
}
</script>

<template>
  <div>
    <Button
      :pt="{
        root: ['p-2 w-40'],
      }"
      label="Добавить"
      @click="isVisibleCreateModal = true"
    ></Button>
    <CreateModal
      v-if="isVisibleCreateModal"
      @close="isVisibleCreateModal = false"
      @create="createTask"
      v-model:hasDuplicateError="hasDuplicateError"
    />
    <TaskList :tasks="tasks" />
  </div>
</template>

<style scoped></style>
