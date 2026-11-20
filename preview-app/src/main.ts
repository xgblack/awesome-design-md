import { createApp } from 'vue'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/space-grotesk/wght.css'
import App from './App.vue'
import './styles.css'

createApp(App).mount('#app')

// Only the atlas shell reloads when the registry changes; unrelated example documents stay put.
if (import.meta.hot) import.meta.hot.on('atlas:catalog-changed', () => window.location.reload())
