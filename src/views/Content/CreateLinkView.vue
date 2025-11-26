<template>
  <div class="container py-4">
    <h2>{{ t('nav.create_link') }}</h2>
    <p class="text-muted">{{ t('content.create_link_subtitle') }}</p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="mb-3">
        <label for="url" class="form-label">{{ t('content.url_label') }}</label>
        <div class="input-group">
          <input
            v-model="url"
            @blur="handleUrlBlur"
            type="url"
            id="url"
            required
            class="form-control"
            placeholder="https://example.com/article"
            :disabled="isLoading"
          />
          <button
            class="btn btn-secondary"
            type="button"
            @click="handleUrlBlur"
            :disabled="isLoading"
          >
            {{ t('content.fetch_preview') }}
          </button>
        </div>
        <div v-if="urlError" class="text-danger mt-1">{{ urlError }}</div>
      </div>

      <div v-if="previewLoading" class="alert alert-info">
        <span class="spinner-border spinner-border-sm me-2"></span>
        {{ t('common.loading') }} {{ t('content.preview') }}...
      </div>

      <div v-if="formData.url && !previewLoading" class="card mb-3 shadow-sm">
        <div class="card-header bg-light">
          {{ t('content.preview') }}
        </div>
        <div class="card-body">
          <div class="d-flex align-items-center mb-3">
            <img
              v-if="formData.imageUrl"
              :src="formData.imageUrl"
              alt="Preview"
              class="me-3 rounded"
              style="width: 100px; height: 100px; object-fit: cover"
            />
            <i v-else class="bi bi-link fs-1 me-3 text-secondary"></i>

            <div>
              <input
                v-model="formData.title"
                type="text"
                class="form-control mb-2"
                :placeholder="t('content.title')"
              />
              <input
                v-model="formData.url"
                type="text"
                readonly
                class="form-control-plaintext text-muted small"
                :placeholder="t('content.url_label')"
              />
            </div>
          </div>

          <textarea
            v-model="formData.description"
            class="form-control"
            rows="3"
            :placeholder="t('content.description_optional')"
          >
          </textarea>
        </div>
      </div>

      <TagSelector v-model="selectedTagIds" class="mb-3" />

      <div v-if="contentStore.error" class="alert alert-danger p-2 text-center" role="alert">
        {{ contentStore.error }}
      </div>

      <button type="submit" :disabled="isLoading || !formData.url" class="btn btn-primary w-100">
        <span v-if="isLoading">{{ t('common.loading') }}</span>
        <span v-else>
          <font-awesome-icon icon="save" class="me-2" />
          {{ t('common.save') }} {{ t('nav.create_link') }}
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/contentStore.ts'
import TagSelector from '@/components/Content/TagSelectorComp.vue'
import type { LinkCreateRequest, LinkParseResponse, UUID } from '@/types/content.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onMounted } from 'vue'

const { t } = useI18n()
const router = useRouter()
const contentStore = useContentStore()

const url = ref('')
const selectedTagIds = ref<UUID[]>([])
const isLoading = ref(false)
const previewLoading = ref(false)
const urlError = ref('')

const formData = reactive<Partial<LinkCreateRequest & LinkParseResponse>>({
  url: '',
  title: '',
  description: '',
  imageUrl: '',
})

const handleUrlBlur = async () => {
  urlError.value = ''
  if (!url.value || !url.value.startsWith('http')) {
    urlError.value = t('content.url_invalid')
    return
  }

  previewLoading.value = true

  const parsed = await contentStore.parseLink(url.value)

  if (parsed) {
    formData.url = url.value
    formData.title = parsed.title
    formData.description = parsed.description
    formData.imageUrl = parsed.imageUrl
  } else {
    urlError.value = t('content.parsing_failed')
    formData.url = url.value
    formData.title = ''
    formData.description = ''
    formData.imageUrl = ''
  }

  previewLoading.value = false
}

const handleSubmit = async () => {
  if (!formData.url || !formData.title) {
    urlError.value = t('auth.required')
    return
  }

  isLoading.value = true

  const request: LinkCreateRequest = {
    url: formData.url,
    title: formData.title,
    description: formData.description,
    imageUrl: formData.imageUrl,
    tagIds: selectedTagIds.value,
  }

  const success = await contentStore.createLink(request)

  isLoading.value = false

  if (success) {
    router.push('/')
  }
}

onMounted(() => {
  contentStore.fetchTags()
})
</script>
