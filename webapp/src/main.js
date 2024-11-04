import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Quasar, Loading, Notify} from 'quasar'
import quasarLang from 'quasar/lang/es'
import bbvaIcon from '@/components/icons/bbva-icon.vue'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import './assets/styles/main.css'

const app = createApp(App)

app.use(router)


app.component('bbva-icon', bbvaIcon)

app.use(Quasar, {
    plugins: {
      Loading,
      Notify,
    }, // import Quasar plugins and add here
    lang: quasarLang,
  })

app.mount('#app')
