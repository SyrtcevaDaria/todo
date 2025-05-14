import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Task } from '@/types.ts'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const hasDuplicate = (values: Omit<Task, 'id' | 'isDone'>) => {
    return values.name && values.deadline
      ? tasks.value.some(
          (task) =>
            task.name === values.name && task.deadline?.getTime() === values.deadline?.getTime(),
        )
      : false
  }
  const addTask = (task: Omit<Task, 'id' | 'isDone'>) => {
    tasks.value.unshift({ ...task, id: crypto.randomUUID(), isDone: false })
  }
  return { tasks, hasDuplicate, addTask }
})
