<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg" style="width: 100%; max-width: 450px">
      <div class="card-body p-4">
        <h2 class="card-title text-center mb-4">{{ t('auth.login') }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="email" class="form-label">{{ t('auth.email') }}</label>
            <input
              v-model="email"
              type="email"
              id="email"
              required
              class="form-control"
              :class="{ 'is-invalid': emailError }"
            />
            <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">{{ t('auth.password') }}</label>
            <input
              v-model="password"
              type="password"
              id="password"
              required
              class="form-control"
              :class="{ 'is-invalid': passwordError }"
            />
            <div v-if="passwordError" class="invalid-feedback">{{ passwordError }}</div>
          </div>

          <div v-if="error" class="alert alert-danger p-2 text-center" role="alert">
            {{ error }}
          </div>

          <button type="submit" :disabled="isLoading || !isFormValid" class="btn btn-primary w-100">
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t('auth.login') }}</span>
          </button>
        </form>

        <p class="mt-3 text-center text-sm">
          {{ t('auth.no_account_prompt') }}
          <router-link to="/register" class="text-decoration-none">
            {{ t('auth.register') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest } from '@/types/auth'

const { t } = useI18n()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const isFormValid = computed(() => email.value && password.value)
const emailError = computed(() => {
  if (!email.value) return null
  if (!email.value.includes('@') || !email.value.includes('.')) return t('auth.error_invalid_email')
  return null
})
const passwordError = computed(() => (password.value ? null : t('auth.required')))

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = t('auth.required')
    return
  }

  isLoading.value = true
  error.value = ''

  const credentials: LoginRequest = {
    email: email.value,
    password: password.value,
  }

  try {
    await authStore.login(credentials)
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      error.value = t('auth.error_auth')
    } else {
      error.value = t('auth.error_auth')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
