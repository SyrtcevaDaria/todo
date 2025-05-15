import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { FilterRules, Task } from '@/types.ts'
import { getStartDay } from '@/utils/formatDate.ts'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const isShowStatistics = ref(false)
  const filterRules = ref<FilterRules>({
    searchNameString: '',
    searchDescriptionString: '',
    tags: [],
    periodExecution: null,
    priority: null,
  })

  const visibleTasks = computed(() => {
    return filteredTasks.value.filter(
      (task) =>
        task.name.startsWith(filterRules.value.searchNameString) &&
        task.description.startsWith(filterRules.value.searchDescriptionString),
    )
  })

  const initState = () => {
    const storedTasks = localStorage.getItem('tasks')
    const storedFilterRules = localStorage.getItem('filterRules')
    const storedIsShowStatistics = localStorage.getItem('isShowStatistics')
    if (storedTasks) {
      tasks.value = JSON.parse(storedTasks)
    }
    if (storedFilterRules) {
      filterRules.value = JSON.parse(storedFilterRules)
    }
    if (storedIsShowStatistics) {
      isShowStatistics.value = JSON.parse(storedIsShowStatistics)
    }
  }
  const saveData = () => {
    try {
      const tasksCopy = JSON.parse(JSON.stringify(tasks.value))
      const filtersCopy = JSON.parse(JSON.stringify(filterRules.value))
      localStorage.setItem('tasks', JSON.stringify(tasksCopy))
      localStorage.setItem('filterRules', JSON.stringify(filtersCopy))
      localStorage.setItem('isShowStatistics', JSON.stringify(isShowStatistics.value))
    } catch (err) {
      console.error('Ошибка при сохранении', err)
    }
  }

  const filteredTasks = computed(() => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    return tasks.value.filter((task) => {
      let tagsMatch = filterRules.value.tags.length === 0
      if (!tagsMatch) {
        tagsMatch = task.tags.some((tag) => filterRules.value.tags.includes(tag))
      }

      let priorityMatch = !filterRules.value.priority
      if (!priorityMatch) {
        priorityMatch = task.priority === filterRules.value.priority
      }

      let periodMatch = !filterRules.value.periodExecution
      if (!periodMatch && task.deadline) {
        const taskDeadline = getStartDay(task.deadline)
        switch (filterRules.value.periodExecution) {
          case 'overdue':
            periodMatch = taskDeadline < currentDate
            break
          case 'today':
            periodMatch = taskDeadline.getTime() === currentDate.getTime()
            break
          case 'future':
            periodMatch = taskDeadline > currentDate
            break
        }
      }
      return tagsMatch && priorityMatch && periodMatch
    })
  })

  const hasDuplicate = (values: Omit<Task, 'id' | 'isDone'>) => {
    return values.name && values.deadline
      ? tasks.value.some(
          (task) =>
            task.name === values.name && task.deadline?.getTime() === values.deadline?.getTime(),
        )
      : false
  }

  const reorderTasks = (newVisibleOrder: Task[]) => {
    const copyTasks = JSON.parse(JSON.stringify(tasks.value))
    const visibleIds = new Set(newVisibleOrder.map((task) => task.id))
    let visibleIndex = 0
    copyTasks.forEach((task: Task, idx: number) => {
      if (visibleIds.has(task.id)) {
        copyTasks[idx] = newVisibleOrder[visibleIndex++]
      }
    })
    tasks.value = copyTasks
  }

  const addTask = (task: Omit<Task, 'id' | 'isDone'>) => {
    tasks.value.unshift({ ...task, id: crypto.randomUUID(), isDone: false })
  }
  const removeTask = (taskId: string) => {
    tasks.value = tasks.value.filter((task) => task.id !== taskId)
  }
  const tags = computed(() => {
    return [...new Set(tasks.value.flatMap((task) => task.tags))]
  })
  return {
    tasks,
    hasDuplicate,
    addTask,
    removeTask,
    tags,
    filterRules,
    visibleTasks,
    initState,
    saveData,
    isShowStatistics,
    reorderTasks,
  }
})
