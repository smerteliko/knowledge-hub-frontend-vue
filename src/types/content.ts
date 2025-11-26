// src/types/content.ts

import type { UUID, BaseEntity } from './common'

export interface Tag {
  id: UUID
  name: string
}

export interface ContentItem extends BaseEntity {
  title: string
  contentType: 'NOTE' | 'LINK'
  tags: Tag[]
}

export interface Note extends ContentItem {
  contentType: 'NOTE'
  content: string
}

export interface Link extends ContentItem {
  contentType: 'LINK'
  url: string
  description: string
  imageUrl: string
  faviconUrl: string
}

export type ContentList = Note | Link

export interface NoteCreateRequest {
  title: string
  content: string
  tagIds: UUID[]
}

export interface LinkCreateRequest {
  url: string
  title?: string
  description?: string
  imageUrl?: string
  tagIds: UUID[]
}

export interface LinkParseResponse {
  title: string
  description: string
  imageUrl: string
  faviconUrl: string
  sourceUrl: string
}
