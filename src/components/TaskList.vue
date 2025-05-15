<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Task } from '@/types.ts'
import TaskCard from '@/components/TaskCard.vue'
import TaskListItem from '@/components/TaskListItem.vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useConfirm } from 'primevue/useconfirm'
import { useTasksStore } from '@/stores/tasks.ts'

const isMobile = ref(false)
const isDragging = ref(false)
const emit = defineEmits<{ remove: [string] }>()
const props = defineProps<{ tasks: Task[] }>()
const visibleTasks = ref(JSON.parse(JSON.stringify(props.tasks)))
const confirm = useConfirm()
const tasksStore = useTasksStore()
const { reorderTasks } = tasksStore
const removeConfirm = (name: string, id: string) => {
  confirm.require({
    message: `Вы уверены, что хотите удалить задачу ${name}?`,
    header: 'Требуется подтверждение',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Отменить',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Да, уверен',
    },
    accept: () => {
      emit('remove', id)
    },
  })
}
onMounted(() => {
  const checkWidth = () => {
    isMobile.value = window.innerWidth <= 720
  }
  checkWidth()
  window.addEventListener('resize', checkWidth)
})
watch(
  () => props,
  () => {
    visibleTasks.value = JSON.parse(JSON.stringify(props.tasks))
  },
  { deep: true },
)

const onDragEnd = (event) => {
  isDragging.value = false
  reorderTasks([...visibleTasks.value])
}
</script>

<template>
  <div class="h-full">
    <VueDraggableNext
      v-if="!isMobile && tasks.length > 0"
      :list="visibleTasks"
      class="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4"
      @start="isDragging = true"
      @end="onDragEnd"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @remove="removeConfirm(task.name, task.id)"
      />
    </VueDraggableNext>
    <VueDraggableNext
      v-else-if="tasks.length > 0"
      :list="visibleTasks"
      class="flex flex-col gap-4"
      @start="isDragging = true"
      @end="onDragEnd"
    >
      <TaskListItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @remove="removeConfirm(task.name, task.id)"
      />
    </VueDraggableNext>
    <div v-else class="h-full flex items-center">
      <img src="@/assets/empty.svg" alt="empty-list" class="w-[300px] mx-auto my-auto" />
    </div>
  </div>
</template>

<style scoped></style>
