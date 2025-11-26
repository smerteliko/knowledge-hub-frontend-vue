<template>
  <div class="container py-4">
    <h2>{{ t('nav.create_note') }}</h2>
    <p class="text-muted">{{ t('content.create_note_subtitle') }}</p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="mb-3">
        <label for="title" class="form-label">{{ t('content.title') }}</label>
        <input
          v-model="title"
          type="text"
          id="title"
          required
          class="form-control"
          :disabled="isLoading"
        />
        <div v-if="titleError" class="text-danger mt-1">{{ titleError }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">{{ t('content.note_content') }}</label>
        <TiptapEditor v-model="content" />
        <div v-if="contentError" class="text-danger mt-1">{{ contentError }}</div>
      </div>

      <TagSelector v-model="selectedTagIds" class="mb-4" />

      <div v-if="contentStore.error" class="alert alert-danger p-2 text-center" role="alert">
        {{ contentStore.error }}
      </div>

      <button type="submit" :disabled="isLoading || !isFormValid" class="btn btn-primary w-100">
        <span v-if="isLoading">{{ t('common.loading') }}</span>
        <span v-else>
          <font-awesome-icon icon="save" class="me-2" />
          {{ t('common.save') }} {{ t('nav.create_note') }}
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/contentStore'
import TiptapEditor from '@/components/Content/TiptapEditorComp.vue'
import TagSelector from '@/components/Content/TagSelectorComp.vue'
import type { NoteCreateRequest, UUID } from '@/types/content'

const { t } = useI18n()
const router = useRouter()
const contentStore = useContentStore()

const title = ref('')
const content = ref('') // Содержимое в HTML формате
const selectedTagIds = ref<UUID[]>([])
const isLoading = ref(false)

const titleError = computed(() =>
  title.value.length < 3 ? t('auth.min_length', { length: 3 }) : null,
)
const contentError = computed(() =>
  content.value.length < 10 ? t('auth.min_length', { length: 10 }) : null,
)
const isFormValid = computed(() => !titleError.value && !contentError.value)

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  const request: NoteCreateRequest = {
    title: title.value,
    content: content.value,
    tagIds: selectedTagIds.value,
  }

  const success = await contentStore.createNote(request)

  isLoading.value = false

  if (success) {
    router.push('/')
  }
}

if (contentStore.tags.length === 0) {
  contentStore.fetchTags()
}
</script>
