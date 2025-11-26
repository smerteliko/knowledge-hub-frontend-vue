<template>
  <div
    class="editor-wrapper border rounded"
    :class="{ 'editor-focused': editor && editor.isFocused }"
  >
    <div v-if="editor" class="toolbar p-2 border-bottom bg-light">
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="btn btn-sm btn-outline-secondary me-1"
        :title="t('editor.bold')"
      >
        <font-awesome-icon icon="bold" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        class="btn btn-sm btn-outline-secondary me-1"
        :title="t('editor.italic')"
      >
        <font-awesome-icon icon="italic" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="btn btn-sm btn-outline-secondary me-1"
        :title="t('editor.bulletList')"
      >
        <font-awesome-icon icon="list-ul" />
      </button>
    </div>

    <editor-content :editor="editor" class="editor-content p-3" />
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount, computed } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useI18n } from 'vue-i18n'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBold, faItalic, faListUl } from '@fortawesome/free-solid-svg-icons'

library.add(faBold, faItalic, faListUl)

const { t } = useI18n()

interface Props {
  modelValue: string
}
const props = defineProps<Props>()

interface Emits {
  (event: 'update:modelValue', value: string): void
}
const emit = defineEmits<Emits>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[200px]',
    },
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value, false)
    }
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.editor-wrapper {
  min-height: 200px;
  border-color: #ced4da;
}
.editor-focused {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
.editor-content :deep(.ProseMirror) {
  min-height: 200px;
  outline: none;
}
.toolbar {
  background-color: #f8f9fa;
}
.toolbar .is-active {
  background-color: #0d6efd;
  color: white;
}
</style>
