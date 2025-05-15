<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { type Priority, PriorityLabelMap } from '@/types'

Chart.register(ArcElement, Tooltip, Legend)

const tasksStore = useTasksStore()

type PriorityCounts = Record<Priority | 'none', number>

const chartData = computed(() => {
  const priorityCounts: PriorityCounts = {
    low: 0,
    medium: 0,
    high: 0,
    none: 0,
  }
  tasksStore.tasks.forEach((task) => {
    const priority = task.priority || 'none'
    priorityCounts[priority]++
  })
  const labels = [
    PriorityLabelMap.low,
    PriorityLabelMap.medium,
    PriorityLabelMap.high,
    'Без приоритета',
  ]
  const backgroundColors = ['#6e97d5', '#FFC107', '#F44336', '#9E9E9E']

  return {
    labels,
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high, priorityCounts.none],
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Распределение задач по приоритетам',
      font: {
        size: 16,
      },
    },
    legend: {
      position: 'right' as const,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${percentage}% - ${value}`
        },
      },
    },
  },
}
</script>

<template>
  <div
    class="relative max-h-[400px] h-full bg-white p-4 rounded-lg shadow-md border border-gray-800"
  >
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped></style>
