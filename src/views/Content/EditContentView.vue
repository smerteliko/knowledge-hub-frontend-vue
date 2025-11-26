<template>
  <div class="container py-4">
    <h2 class="mb-4">
      {{ t('common.edit') }} {{ isNote ? t('nav.create_note') : t('nav.create_link') }}
    </h2>

    <div v-if="isLoading" class="alert alert-info">
      <span class="spinner-border spinner-border-sm me-2"></span>
      {{ t('common.loading') }}...
    </div>

    <div v-else-if="!contentItem" class="alert alert-danger">
      {{ t('content.item_not_found') }}
    </div>

    <div v-else>
      <EditNoteForm v-if="isNote" :initial-data="contentItem as Note" />
      <EditLinkForm v-else-if="isLink" :initial-data="contentItem as Link" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '@/stores/contentStore'
import EditNoteForm from '@/components/Content/EditNoteFormComp.vue' // Создадим эти формы
import EditLinkForm from '@/components/Content/EditLinkFormComp.vue'
import type { Note, Link, ContentList } from '@/types/content'
import type { UUID } from '@/types/common'

const { t } = useI18n()
const route = useRoute()
const contentStore = useContentStore()

const contentItem = ref<Note | Link | null>(null)
const isLoading = ref(true)

const isNote = computed(() => contentItem.value?.contentType === 'NOTE')
const isLink = computed(() => contentItem.value?.contentType === 'LINK')

onMounted(async () => {
  const id = route.params.id as UUID

  const data = await contentStore.fetchContentById(id)

  if (data) {
    contentItem.value = data
  } else {
    contentStore.error = t('content.item_not_found')
  }
  isLoading.value = false
})
</script>
