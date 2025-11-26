<template>
  <div class="tag-selector">
    <label class="form-label d-flex justify-content-between align-items-center">
      {{ t('content.tags') }}
      <button
        type="button"
        class="btn btn-sm btn-outline-success"
        data-bs-toggle="modal"
        data-bs-target="#tagCreatorModal"
      >
        <font-awesome-icon icon="plus" class="me-1" />
        {{ t('content.new_tag_btn') }}
      </button>
    </label>

    <div
      class="tag-checkbox-group border rounded p-2"
      :style="{ maxHeight: '150px', overflowY: 'auto' }"
    >
      <div
        v-if="contentStore.tags.length === 0 && !contentStore.isLoading"
        class="text-muted small"
      >
        {{ t('content.no_tags_available') }}
      </div>

      <div v-for="tag in contentStore.tags" :key="tag.id" class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="checkbox"
          :id="'tag-' + tag.id"
          :value="tag.id"
          v-model="selectedTags"
          :disabled="contentStore.isLoading"
        />
        <label class="form-check-label" :for="'tag-' + tag.id">
          <span
            class="badge"
            :class="selectedTags.includes(tag.id) ? 'bg-primary' : 'bg-secondary'"
          >
            <font-awesome-icon icon="tag" class="me-1" />
            {{ tag.name }}
          </span>
        </label>
      </div>
    </div>
    <small class="form-text text-muted">
      {{ t('content.tag_selector_help') }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '@/stores/contentStore'
import type { UUID } from '@/types/common'

const { t } = useI18n()
const contentStore = useContentStore()

interface Props {
  modelValue: UUID[]
}
const props = defineProps<Props>()

interface Emits {
  (event: 'update:modelValue', value: UUID[]): void
}
const emit = defineEmits<Emits>()

const selectedTags = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
<style scoped>
.form-check-label {
  cursor: pointer;
  margin-right: 0.5rem;
}
.tag-checkbox-group .form-check-input {
  display: none;
}
.form-check-inline {
  margin-right: 0;
}
</style>
