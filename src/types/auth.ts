// src/types/auth.ts

import type { UUID } from './common'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  username: string
}

export interface JwtResponse {
  token: string
  username: string
  email: string
  userId: UUID
}

export interface UserData {
  userId: UUID
  username: string
  email: string
}
