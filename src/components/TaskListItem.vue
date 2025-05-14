<script setup lang="ts">
import { type Task } from '@/types.ts'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import TaskCard from '@/components/TaskCard.vue'
import { ref } from 'vue'
const task = defineModel<Task>('task', { required: true })
const cardIsOpen = ref(false)
</script>

<template>
  <div
    :class="
      !task.isDone && task.deadline && new Date(task.deadline) < new Date()
        ? 'border-red-500 bg-red-50'
        : 'border-gray-800 bg-white '
    "
    class="rounded-lg p-4 border flex gap-1 !min-w-[18rem] justify-between items-center"
  >
    <div class="flex items-center gap-2">
      <Checkbox v-model="task.isDone" binary />
      <span class="!font-semibold !mr-2" :class="task.isDone ? 'line-through' : ''">{{
        task.name
      }}</span>
    </div>
    <Button label="Открыть" severity="" class="!h-8" rounded @click="cardIsOpen = true"></Button>
    <Dialog
      v-model:visible="cardIsOpen"
      modal
      header="Развернутая информация"
      class="min-w-[300px] max-w-[500px] w-full"
    >
      <TaskCard :task="task" />
    </Dialog>
  </div>
</template>

<style scoped></style>
