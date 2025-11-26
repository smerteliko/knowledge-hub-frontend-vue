// src/types/common.ts

export type UUID = string

export interface BaseEntity {
  id: UUID
  createdAt: string // ISO Date String
  updatedAt: string // ISO Date String
}

export interface ApiError {
  status: number
  message: string
  details?: any
}
