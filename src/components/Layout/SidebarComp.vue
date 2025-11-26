<template>
  <div
    class="d-flex flex-column flex-shrink-0 p-3 bg-light"
    style="width: 280px; height: 100vh; position: fixed"
  >
    <h5 class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
      <font-awesome-icon icon="book" class="me-2" />
      <span class="fs-4">Knowledge Hub</span>
    </h5>
    <hr />

    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link
          to="/"
          class="nav-link"
          :class="{ active: $route.path === '/' }"
          aria-current="page"
        >
          <font-awesome-icon icon="house" class="me-2" />
          {{ t('nav.dashboard') }}
        </router-link>
      </li>
      <hr class="my-3" />

      <li>
        <router-link to="/create/note" class="nav-link text-success">
          <font-awesome-icon icon="file-lines" class="me-2" />
          {{ t('nav.create_note') }}
        </router-link>
      </li>
      <li>
        <router-link to="/create/link" class="nav-link text-info">
          <font-awesome-icon icon="link" class="me-2" />
          {{ t('nav.create_link') }}
        </router-link>
      </li>
    </ul>

    <hr />

    <div class="dropdown">
      <a
        href="#"
        class="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
        id="dropdownUser1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <font-awesome-icon icon="user" class="me-2 fs-5 text-secondary" />

        <strong class="me-1">{{ authStore.user?.username }}</strong>
      </a>

      <ul
        class="dropdown-menu dropdown-menu-dark text-small shadow"
        aria-labelledby="dropdownUser1"
      >
        <li>
          <a class="dropdown-item" href="/profile">
            <font-awesome-icon icon="user" class="me-2" />
            {{ t('nav.profile') }}
          </a>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="handleLogout">
            <font-awesome-icon icon="right-from-bracket" class="me-2" />
            {{ t('auth.logout') }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import * as bootstrap from 'bootstrap'
import { onMounted } from 'vue'

onMounted(() => {
  const dropdownElement = document.getElementById('dropdownUser1')
  if (dropdownElement) {
    new bootstrap.Dropdown(dropdownElement)
  }
})

const { t } = useI18n()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.nav-link.active {
  background-color: #0d6efd !important;
  color: white !important;
}

.d-flex {
  overflow-y: auto;
}
</style>
