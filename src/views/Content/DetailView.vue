<template>
  <div class="container py-4">
    <div v-if="isLoading" class="alert alert-info">
      <span class="spinner-border spinner-border-sm me-2"></span>
      {{ t('common.loading') }}...
    </div>

    <div v-else-if="contentStore.error" class="alert alert-danger">
      {{ contentStore.error }}
    </div>

    <div v-else-if="contentItem" class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center bg-light">
        <h3 class="mb-0">
          <i
            :class="[
              'me-2',
              isNote ? 'bi bi-file-earmark-text-fill text-success' : 'bi bi-link-45deg text-info',
            ]"
          ></i>
          {{ contentItem.title }}
        </h3>

        <div class="d-flex align-items-center">
          <button
            type="button"
            class="btn btn-sm btn-outline-primary me-2"
            @click="router.push(`/edit/${contentItem.id}`)"
            :title="t('common.edit')"
          >
            <font-awesome-icon icon="edit" class="me-1" /> {{ t('common.edit') }}
          </button>

          <div class="dropdown me-2">
            <button
              class="btn btn-sm btn-outline-info dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <font-awesome-icon icon="download" /> {{ t('content.export') }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="contentStore.exportContent(contentItem.id, 'pdf')"
                  >PDF</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="contentStore.exportContent(contentItem.id, 'md')"
                  >Markdown</a
                >
              </li>
            </ul>
          </div>

          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="confirmAndDelete(contentItem.id, contentItem.title)"
            :title="t('common.delete')"
          >
            <font-awesome-icon icon="trash" />
          </button>
        </div>
      </div>

      <div class="card-body">
        <div class="mb-3 text-muted small">
          {{ t('content.created_at') }}: {{ new Date(contentItem.createdAt).toLocaleString() }} |
          {{ t('content.updated_at') }}: {{ new Date(contentItem.updatedAt).toLocaleString() }}
        </div>

        <div class="mb-4">
          <span v-for="tag in contentItem.tags" :key="tag.id" class="badge bg-secondary me-1">
            <font-awesome-icon icon="tag" /> {{ tag.name }}
          </span>
        </div>

        <div v-if="isNote" class="content-body" v-html="(contentItem as Note).content"></div>

        <div v-else-if="isLink">
          <p>
            <strong>{{ t('content.url_label') }}:</strong>
            <a :href="(contentItem as Link).url" target="_blank">{{ (contentItem as Link).url }}</a>
          </p>
          <p>
            <strong>{{ t('content.description') }}:</strong> {{ (contentItem as Link).description }}
          </p>
          <img
            v-if="(contentItem as Link).imageUrl"
            :src="(contentItem as Link).imageUrl"
            alt="Link Preview"
            class="img-fluid rounded"
            style="max-height: 250px"
          />
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">{{ t('content.item_not_found') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '@/stores/contentStore'
import type { ContentList, Note, Link, UUID } from '@/types/content'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faDownload, faTrash, faTag, faLink } from '@fortawesome/free-solid-svg-icons'

library.add(faEdit, faDownload, faTrash, faTag, faLink)

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()

const contentItem = ref<ContentList | null>(null)
const isLoading = ref(true)

const isNote = computed(() => contentItem.value?.contentType === 'NOTE')
const isLink = computed(() => contentItem.value?.contentType === 'LINK')

const confirmAndDelete = async (id: UUID, title: string) => {
  if (confirm(t('common.confirm_delete', { title: title }))) {
    const success = await contentStore.deleteContent(id)
    if (success) {
      router.push('/')
    }
  }
}

onMounted(async () => {
  const id = route.params.id as UUID

  // Загрузка данных
  const data = await contentStore.fetchContentById(id)

  if (data) {
    contentItem.value = data
  } else {
    contentStore.error = t('content.item_not_found')
  }
  isLoading.value = false
})
</script>

<style scoped>
.content-body :deep(*) {
  max-width: 100%;
}
</style>
