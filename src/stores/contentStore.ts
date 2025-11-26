// src/stores/contentStore.ts

import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient'
import type { Note, Link } from '@/types/content'
import type {
  ContentList,
  LinkCreateRequest,
  LinkParseResponse,
  NoteCreateRequest,
  Tag,
  UUID,
} from '@/types/content'

import i18n from '@/i18n/i18n.ts'
const t = i18n.global.t

export interface ContentState {
  allContent: ContentList[]
  tags: Tag[]
  isLoading: boolean
  error: string | null
}

export const useContentStore = defineStore('content', {
  state: (): ContentState => ({
    allContent: [],
    tags: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    getNoteCount: (state) => state.allContent.filter((item) => item.contentType === 'NOTE').length,
    getLinkCount: (state) => state.allContent.filter((item) => item.contentType === 'LINK').length,
  },
  actions: {
    async fetchAllData() {
      return this.fetchContent('')
    },

    async fetchContent(query: string = '') {
      this.isLoading = true
      this.error = null

      try {
        let endpoint: string
        let params: { query?: string } = {}

        if (query) {
          endpoint = '/search'
          params = { query }
        } else {
          endpoint = '/content'
        }

        const contentResponse = await apiClient.get<ContentList[]>(endpoint, { params })
        this.allContent = contentResponse.data

        if (this.tags.length === 0) {
          const tagsResponse = await apiClient.get<Tag[]>('/tags')
          this.tags = tagsResponse.data
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || t('content.error_fetch')
        this.allContent = []
      } finally {
        this.isLoading = false
      }
    },

    async fetchTags() {
      try {
        const response = await apiClient.get<Tag[]>('/tags')
        this.tags = response.data
      } catch (error) {
        console.error('Failed to fetch tags.')
      }
    },

    async createTag(name: string) {
      try {
        const response = await apiClient.post<Tag>('/tags', { name })
        this.tags.push(response.data)
        return true
      } catch (error) {
        this.error = 'Failed to create tag.'
        return false
      }
    },

    async createNote(request: NoteCreateRequest): Promise<boolean> {
      this.error = null
      try {
        const response = await apiClient.post<ContentList>('/content/note', request)
        this.allContent.unshift(response.data)
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || t('content.error_create_note')
        return false
      }
    },

    async createLink(request: LinkCreateRequest): Promise<boolean> {
      this.error = null
      try {
        const response = await apiClient.post<ContentList>('/content/link', request)
        this.allContent.unshift(response.data)
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || t('content.error_create_link')
        return false
      }
    },

    async deleteContent(id: UUID): Promise<boolean> {
      this.error = null
      try {
        await apiClient.delete(`/content/${id}`)
        this.allContent = this.allContent.filter((item) => item.id !== id)
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || t('content.error_delete')
        return false
      }
    },

    async parseLink(url: string): Promise<LinkParseResponse | null> {
      try {
        const response = await apiClient.post<LinkParseResponse>('/links/parse', { url })
        return response.data
      } catch (error: any) {
        console.warn(`Parsing failed for URL: ${url}`, error)
        return null
      }
    },

    async exportContent(id: UUID, format: 'pdf' | 'md'): Promise<boolean> {
      this.error = null
      try {
        const response = await apiClient.get(`/content/${id}/export`, {
          params: { format },
          responseType: 'blob',
        })

        const contentDisposition = response.headers['content-disposition']
        let filename = `export.${format}`
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/)
          if (match && match[1]) {
            filename = match[1]
          }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        return true
      } catch (error: any) {
        this.error = t('content.error_export')
        console.error('Export error:', error)
        return false
      }
    },
    async updateContent(
      id: UUID,
      request: NoteCreateRequest | LinkCreateRequest,
    ): Promise<boolean> {
      this.error = null
      try {
        const contentTypeSegment = 'content' in request ? 'note' : 'link'

        const response = await apiClient.put<Note | Link>(
          `/content/${contentTypeSegment}/${id}`,
          request,
        )

        const index = this.allContent.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.allContent[index] = response.data as ContentList
        }
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || t('content.error_update')
        return false
      }
    },

    async fetchContentById(id: UUID): Promise<Note | Link | null> {
      try {
        const localItem = this.allContent.find((item) => item.id === id)
        if (localItem) return localItem as Note | Link

        const response = await apiClient.get<Note | Link>(`/content/${id}`)
        return response.data
      } catch (error) {
        console.error(`Failed to fetch item ${id}.`, error)
        return null
      }
    },
    async searchContent(query: string): Promise<ContentList[]> {
      this.error = null
      if (query.length < 3) {
        return []
      }
      try {
        const response = await apiClient.get<ContentList[]>(`/search`, {
          params: { query },
        })
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || t('content.error_search')
        console.error('Search error:', error)
        return []
      }
    },
  },
})
