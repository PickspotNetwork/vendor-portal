import { useState } from 'react'
import { authApi, SignupRequest, LoginRequest } from '@/lib/api'
import { useRouter } from 'next/navigation'

export interface AuthState {
  isLoading: boolean
  error: string | null
  success: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    success: null
  })
  const router = useRouter()

  const clearMessages = () => {
    setAuthState(prev => ({ ...prev, error: null, success: null }))
  }

  const signup = async (userData: SignupRequest) => {
    setAuthState({ isLoading: true, error: null, success: null })
    
    try {
      const response = await authApi.signup(userData)
      setAuthState({
        isLoading: false,
        error: null,
        success: response.message || 'Account created successfully! Please login.'
      })
      return { success: true, data: response }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed'
      setAuthState({
        isLoading: false,
        error: errorMessage,
        success: null
      })
      return { success: false, error: errorMessage }
    }
  }

  const login = async (credentials: LoginRequest) => {
    setAuthState({ isLoading: true, error: null, success: null })
    
    try {
      const response = await authApi.login(credentials)
      setAuthState({
        isLoading: false,
        error: null,
        success: response.message || 'Login successful!'
      })
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
      
      return { success: true, data: response }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState({
        isLoading: false,
        error: errorMessage,
        success: null
      })
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    setAuthState({ isLoading: true, error: null, success: null })
    
    try {
      const response = await authApi.logout()
      setAuthState({
        isLoading: false,
        error: null,
        success: response.message || 'Logged out successfully'
      })
      
      // Redirect to login page after successful logout
      setTimeout(() => {
        router.push('/')
      }, 1500)
      
      return { success: true, data: response }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      setAuthState({
        isLoading: false,
        error: errorMessage,
        success: null
      })
      return { success: false, error: errorMessage }
    }
  }

  return {
    ...authState,
    signup,
    login,
    logout,
    clearMessages
  }
}
