<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Task } from '@/types.ts'
import TaskCard from '@/components/TaskCard.vue'
import TaskListItem from '@/components/TaskListItem.vue'

const isMobile = ref(false)
defineProps<{ tasks: Task[] }>()
onMounted(() => {
  const checkWidth = () => {
    isMobile.value = window.innerWidth <= 720
  }
  checkWidth()
  window.addEventListener('resize', checkWidth)
})
</script>

<template>
  <div v-if="!isMobile" class="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
    <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
  </div>
  <div v-else class="flex flex-col gap-4">
    <TaskListItem v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>

<style scoped></style>
