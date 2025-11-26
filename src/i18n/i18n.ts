// src/i18n.ts

import { createI18n } from 'vue-i18n'
import en from './files/en.json'
import ru from './files/ru.json'
import fr from './files/fr.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('user_locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
    fr,
  },
})

export default i18n
