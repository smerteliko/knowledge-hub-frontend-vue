<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="edit-title" class="form-label">{{ t('content.title') }}</label>
      <input v-model="formData.title" type="text" id="edit-title" required class="form-control" />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ t('content.note_content') }}</label>
      <TiptapEditor v-model="formData.content" />
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
import TiptapEditor from './TiptapEditorComp.vue'
import TagSelector from './TagSelectorComp.vue'
import type { Note, NoteCreateRequest, UUID } from '@/types/content'

const { t } = useI18n()
const router = useRouter()
const contentStore = useContentStore()

interface Props {
  initialData: Note
}
const props = defineProps<Props>()

const isLoading = ref(false)

const formData = reactive<NoteCreateRequest & { id: UUID }>({
  id: props.initialData.id,
  title: props.initialData.title,
  content: props.initialData.content,
  tagIds: props.initialData.tags.map((tag) => tag.id),
})

const handleSubmit = async () => {
  isLoading.value = true

  const request: NoteCreateRequest = {
    title: formData.title,
    content: formData.content,
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
