// src/stores/authStore.ts

import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient'
import router from '@/router'
import type { UserData, LoginRequest, RegisterRequest, JwtResponse } from '@/types/auth'

const TOKEN_KEY = 'jwt_token'
const USER_KEY = 'user_data'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null') as UserData | null,
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    userId: (state) => state.user?.userId,
  },
  actions: {
    setAuthData(data: JwtResponse, userData: UserData) {
      this.token = data.token
      this.user = userData
      this.isAuthenticated = true
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
    },

    clearAuthData() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      router.push('/login')
    },

    async register(credentials: RegisterRequest) {
      const response = await apiClient.post<JwtResponse>('/auth/register', credentials)
      const userData: UserData = {
        userId: response.data.userId,
        username: response.data.username,
        email: response.data.email,
      }
      this.setAuthData(response.data, userData)
      router.push('/')
    },

    async login(credentials: LoginRequest) {
      const response = await apiClient.post<JwtResponse>('/auth/login', credentials)

      const userData: UserData = {
        userId: response.data.userId,
        username: response.data.username,
        email: response.data.email,
      }
      this.setAuthData(response.data, userData)
      router.push('/')
    },
    async logout() {
      try {
        await apiClient.post('/auth/logout')
      } catch (error) {
        console.warn('Logout API call failed, but clearing client state anyway.', error)
      }

      this.clearAuthData()
    },
  },
})
