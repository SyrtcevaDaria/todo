<script setup lang="ts">
import MainComponent from '@/components/MainComponent.vue'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <header></header>
  <main class="p-4 min-h-full w-full">
    <MainComponent class="h-full" />
    <ConfirmDialog :pt="{ root: ['mx-5'] }" />
  </main>
</template>

<style scoped></style>
