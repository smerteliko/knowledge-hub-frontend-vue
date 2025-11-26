import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from '@/i18n/i18n.ts'

import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHouse, // Замена faHouseDoor
  faSearch,
  faFileLines, // Замена faFileEarmarkText (для документов)
  faLink,
  faRightFromBracket, // Замена faBoxArrowRight (для выхода)
  faBook, // Замена faBookHalf
  faUser,
  faTag,
  faTrash,
  faEdit,
  faDownload,
  faPlus,
  faSave,
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faHouse,
  faSearch,
  faFileLines,
  faLink,
  faRightFromBracket,
  faBook,
  faUser,
  faTag,
  faTrash,
  faEdit,
  faDownload,
  faPlus,
  faSave,
)
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
