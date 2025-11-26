<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg" style="width: 100%; max-width: 450px">
      <div class="card-body p-4">
        <h2 class="card-title text-center mb-4">{{ t('auth.register') }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="username" class="form-label">{{ t('auth.username') }}</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="form-control"
              :class="{ 'is-invalid': usernameError }"
            />
            <div v-if="usernameError" class="invalid-feedback">{{ usernameError }}</div>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">{{ t('auth.email') }}</label>
            <input
              v-model="email"
              type="email"
              id="email"
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
              class="form-control"
              :class="{ 'is-invalid': passwordError }"
            />
            <div v-if="passwordError" class="invalid-feedback">{{ passwordError }}</div>
          </div>

          <div v-if="globalError" class="alert alert-danger p-2 text-center" role="alert">
            {{ globalError }}
          </div>

          <button type="submit" :disabled="isLoading || !isFormValid" class="btn btn-primary w-100">
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t('auth.register') }}</span>
          </button>
        </form>

        <p class="mt-3 text-center text-sm">
          {{ t('auth.have_account_prompt') }}
          <router-link to="/login" class="text-decoration-none">
            {{ t('auth.login') }}
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
import type { RegisterRequest } from '@/types/auth'

const { t } = useI18n()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const globalError = ref('')

const validateField = (value: string, minLength: number) => {
  if (!value) return t('auth.required')
  if (value.length < minLength) return t('auth.min_length', { length: minLength })
  return null
}

const usernameError = computed(() => validateField(username.value, 3))
const passwordError = computed(() => validateField(password.value, 6))

const emailError = computed(() => {
  if (!email.value) return t('auth.required')
  if (!email.value.includes('@') || !email.value.includes('.')) return t('auth.error_invalid_email')
  return null
})

const isFormValid = computed(
  () => !usernameError.value && !emailError.value && !passwordError.value,
)

const handleSubmit = async () => {
  if (!isFormValid.value) {
    globalError.value = t('auth.error_validation_failed')
    return
  }

  isLoading.value = true
  globalError.value = ''

  const credentials: RegisterRequest = {
    username: username.value,
    email: email.value,
    password: password.value,
  }

  try {
    await authStore.register(credentials)
  } catch (err: any) {
    if (err.response && err.response.status === 409) {
      globalError.value = t('auth.error_email_in_use')
    } else {
      globalError.value = t('auth.error_auth')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
