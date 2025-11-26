<template>
  <div v-if="authStore.isLoggedIn" class="d-flex">
    <Sidebar />

    <main class="flex-grow-1 p-3" :style="{ marginLeft: '280px' }">
      <router-view />
    </main>
  </div>

  <div v-else>
    <router-view />
  </div>
  <TagCreatorModal v-if="authStore.isLoggedIn" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import Sidebar from '@/components/Layout/SidebarComp.vue'
import TagCreatorModal from '@/components/Content/Modals/TagCreatorModal.vue'

const authStore = useAuthStore()
</script>

<style>
body {
  overflow-x: hidden;
}
main {
  min-height: 100vh;
}
</style>
