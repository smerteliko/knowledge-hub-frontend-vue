<template>
  <div
    class="modal fade"
    id="tagCreatorModal"
    tabindex="-1"
    aria-labelledby="tagCreatorModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="tagCreatorModalLabel">{{ t('content.create_new_tag') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="handleCreateTag">
          <div class="modal-body">
            <div class="mb-3">
              <label for="tagName" class="form-label">{{ t('content.tag_name') }}</label>
              <input v-model="tagName" type="text" class="form-control" id="tagName" required />
              <div v-if="error" class="text-danger mt-2">{{ error }}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              {{ t('common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading || !tagName">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
              {{ t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '@/stores/contentStore'
import * as bootstrap from 'bootstrap'

const { t } = useI18n()
const contentStore = useContentStore()

const tagName = ref('')
const isLoading = ref(false)
const error = ref('')

let modalInstance: bootstrap.Modal | null = null

onMounted(() => {
  const modalElement = document.getElementById('tagCreatorModal')
  if (modalElement) {
    modalInstance = new bootstrap.Modal(modalElement)
    modalElement.addEventListener('hidden.bs.modal', () => {
      tagName.value = ''
      error.value = ''
    })
  }
})

const handleCreateTag = async () => {
  isLoading.value = true
  error.value = ''

  const success = await contentStore.createTag(tagName.value)

  if (success) {
    if (modalInstance) {
      modalInstance.hide()
    }
  } else {
    error.value = contentStore.error || t('content.tag_creation_failed')
  }
  isLoading.value = false
}

const showModal = () => {
  if (modalInstance) {
    modalInstance.show()
  }
}
defineExpose({ showModal })
</script>
