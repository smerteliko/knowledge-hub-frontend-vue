<template>
  <div class="container-fluid py-3">
    <div class="row mb-4">
      <div class="col">
        <h2>{{ t('nav.dashboard') }}</h2>
        <p class="text-muted">{{ t('common.welcome') }}, {{ authStore.user?.username }}.</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-primary mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ contentStore.getNoteCount }}</h5>
            <p class="card-text">{{ t('content.notes_stored') }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-success mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ contentStore.getLinkCount }}</h5>
            <p class="card-text">{{ t('content.links_stored') }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card text-dark bg-light mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ contentStore.tags.length }}</h5>
            <p class="card-text">{{ t('content.total_tags') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-6">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-lg"
          :placeholder="t('content.search_placeholder')"
        />
      </div>
      <div v-if="searchQuery" class="col-md-6 d-flex align-items-center">
        <h5 class="text-muted mb-0">
          {{ t('content.search_results', { count: contentStore.allContent.length }) }}
        </h5>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h4>{{ t('common.recent_items') }}</h4>

        <div v-if="contentStore.isLoading" class="alert alert-info">
          <span class="spinner-border spinner-border-sm me-2"></span>
          {{ t('common.loading') }}...
        </div>

        <div v-else-if="contentStore.error" class="alert alert-danger">
          {{ contentStore.error }}
        </div>

        <div v-else-if="contentStore.allContent.length === 0" class="alert alert-secondary">
          {{ t('content.no_content_found') }}
        </div>

        <table v-else-if="contentStore.allContent.length > 0" class="table table-hover">
          <thead>
            <tr>
              <th scope="col" style="width: 5%">#</th>
              <th scope="col" style="width: 40%">{{ t('content.title') }}</th>
              <th scope="col" style="width: 20%">{{ t('content.tags') }}</th>
              <th scope="col" style="width: 15%">{{ t('content.created_at') }}</th>
              <th scope="col" style="width: 15%">{{ t('content.updated_at') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in contentStore.allContent" :key="item.id">
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <router-link :to="`/item/${item.id}`" class="text-decoration-none text-dark">
                  <i
                    :class="[
                      'me-2',
                      item.contentType === 'NOTE'
                        ? 'bi bi-file-earmark-text-fill text-success'
                        : 'bi bi-link-45deg text-info',
                    ]"
                  ></i>
                  <span class="text-truncate d-inline-block" style="max-width: 95%">
                    {{ item.title }}
                  </span>
                </router-link>
              </td>
              <td>
                <span v-for="tag in item.tags" :key="tag.id" class="badge bg-secondary me-1">
                  <font-awesome-icon icon="tag" /> {{ tag.name }}
                </span>
              </td>
              <td>
                {{ new Date(item.createdAt).toLocaleString() }}
              </td>
              <td>
                {{ new Date(item.updatedAt).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useContentStore } from '@/stores/contentStore'
import { debounce } from 'lodash'

const { t } = useI18n()
const authStore = useAuthStore()
const contentStore = useContentStore()

const searchQuery = ref('')

const debouncedFetchContent = debounce((query: string) => {
  contentStore.fetchContent(query)
}, 300)

watch(searchQuery, (newQuery) => {
  debouncedFetchContent(newQuery)
})

onMounted(() => {
  contentStore.fetchContent()
})
</script>
