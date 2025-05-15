import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import Material from '@primeuix/themes/aura'
const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: false,
    },
  },
})
app.use(ConfirmationService)
app.mount('#app')
