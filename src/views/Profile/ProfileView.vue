<template>
  <div class="container py-4">
    <h2>{{ t('nav.profile') }}</h2>
    <p class="text-muted">{{ t('profile.subtitle') }}</p>

    <div class="card mb-4">
      <div class="card-header">{{ t('profile.account_details') }}</div>
      <div class="card-body">
        <p>
          <strong>{{ t('auth.username') }}:</strong> {{ authStore.user?.username }}
        </p>
        <p>
          <strong>{{ t('auth.email') }}:</strong>
          {{ authStore.user?.email || t('content.email_unavailable') }}
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">{{ t('profile.app_settings') }}</div>
      <div class="card-body">
        <label class="form-label">{{ t('profile.language') }}</label>
        <select v-model="currentLocale" class="form-select w-auto">
          <option value="en">{{ t('lang.en') }}</option>
          <option value="ru">{{ t('lang.ru') }}</option>
          <option value="fr">{{ t('lang.fr') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const { t, locale } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const currentLocale = computed({
  get: () => locale.value,
  set: (newLocale) => {
    locale.value = newLocale
    localStorage.setItem('user_locale', newLocale)
  },
})
</script>
