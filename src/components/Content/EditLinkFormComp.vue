<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="edit-url" class="form-label">{{ t('content.url_label') }}</label>
      <input
        type="url"
        id="edit-url"
        readonly
        :value="formData.url"
        class="form-control-plaintext"
      />
    </div>

    <div class="mb-3">
      <label for="edit-link-title" class="form-label">{{ t('content.title') }}</label>
      <input
        v-model="formData.title"
        type="text"
        id="edit-link-title"
        required
        class="form-control"
      />
    </div>

    <div class="mb-3">
      <label for="edit-description" class="form-label">{{ t('content.description') }}</label>
      <textarea
        v-model="formData.description"
        id="edit-description"
        class="form-control"
        rows="3"
      ></textarea>
    </div>

    <TagSelector v-model="formData.tagIds" class="mb-4" />
    <div class="row mb-3">
      <div class="col-md-6">
        <p class="">
          <b>{{ t('content.created_at') }}:</b>
          {{ new Date(props.initialData.createdAt).toLocaleString() }}
        </p>
        <p class="">
          <b>{{ t('content.updated_at') }}:</b>
          {{ new Date(props.initialData.updatedAt).toLocaleString() }}
        </p>
      </div>
    </div>
    <div v-if="contentStore.error" class="alert alert-danger p-2">{{ contentStore.error }}</div>

    <button type="submit" :disabled="isLoading" class="btn btn-primary w-100">
      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
      {{ t('common.save') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/contentStore'
import TagSelector from './TagSelectorComp.vue'
import type { Link, LinkCreateRequest, UUID } from '@/types/content'

const { t } = useI18n()
const router = useRouter()
const contentStore = useContentStore()

interface Props {
  initialData: Link
}
const props = defineProps<Props>()

const isLoading = ref(false)

const formData = reactive<LinkCreateRequest & { id: UUID }>({
  id: props.initialData.id,
  url: props.initialData.url, // URL is needed but read-only
  title: props.initialData.title,
  description: props.initialData.description,
  imageUrl: props.initialData.imageUrl,
  tagIds: props.initialData.tags.map((tag) => tag.id),
})

const handleSubmit = async () => {
  isLoading.value = true

  const request: LinkCreateRequest = {
    url: formData.url,
    title: formData.title,
    description: formData.description,
    imageUrl: formData.imageUrl,
    tagIds: formData.tagIds,
  }

  const success = await contentStore.updateContent(formData.id, request)

  isLoading.value = false

  if (success) {
    router.push('/')
  }
}

onMounted(() => {
  contentStore.fetchTags()
})
</script>
