<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { tasks } = storeToRefs(useTasksStore())

const chartData = computed(() => {
  const tagCounts: Record<string, number> = {}
  tasks.value.forEach((task) => {
    task.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const tagNames = Object.entries(tagCounts).map(([tagName]) => tagName)
  const colors = ['#10b981', '#afe8c2']

  const backgroundColors = tagNames.map((_, index) => colors[index % 2])

  return {
    labels: tagNames,
    datasets: [
      {
        label: 'Количество задач',
        data: tagNames.map((tagName) => tagCounts[tagName]),
        backgroundColor: backgroundColors,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = {
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Распределение задач по тегам',
      font: {
        size: 16,
      },
    },
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          const total = tasks.value.length
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${percentage}% - ${value}`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
      title: {
        display: true,
        text: 'Количество задач',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Теги задач',
      },
    },
  },
}
</script>

<template>
  <div class="relative h-[400px] bg-white p-4 rounded-lg shadow-md border border-gray-800">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped></style>
