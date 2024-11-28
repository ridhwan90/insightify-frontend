import { type authUser, loginApi, logoutApi, refreshToken, setAxiosToken, validateSession } from "@/service/authApi"
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { axiosInstance } from "@/service/authApi"
import { AxiosError, InternalAxiosRequestConfig } from "axios"

export type AuthContext = {
    isLoading: boolean
    accessToken: string | null
    currentUser: authUser | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    fetchCurrentUser: () => Promise<void>
}

const AuthContext = createContext<AuthContext | undefined>(undefined)

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

export default function AuthProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState(true)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<authUser | null>(null)

    // Set up axios interceptor for token refresh
    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as ExtendedAxiosRequestConfig

                if (!originalRequest || !error.response) {
                    return Promise.reject(error)
                }

                // If the error is 403 and we haven't retried yet
                if (error.response.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true

                    try {
                        // Try to refresh the token
                        const response = await refreshToken()
                        const newToken = response.accessToken

                        // Update the token in state and axios
                        setAccessToken(newToken)
                        setAxiosToken(newToken)

                        // Retry the original request
                        if (originalRequest.headers) {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                        }
                        return axiosInstance(originalRequest)
                    } catch (refreshError) {
                        // If refresh fails, log the user out
                        setAccessToken(null)
                        setCurrentUser(null)
                        return Promise.reject(refreshError)
                    }
                }

                return Promise.reject(error)
            }
        )

        return () => {
            axiosInstance.interceptors.response.eject(interceptor)
        }
    }, [])

    // Update axios token when accessToken changes
    useEffect(() => {
        setAxiosToken(accessToken)
    }, [accessToken])

    const fetchCurrentUser = async () => {
        try {
            setIsLoading(true)
            const user = await validateSession()
            setCurrentUser(user)
        } catch (error) {
            console.error('Fetch user error:', error)
            setCurrentUser(null)
            setAccessToken(null)
            setAxiosToken(null)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch user on mount and handle token from localStorage
    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('accessToken')
        if (token) {
            setAccessToken(token)
            setAxiosToken(token)
        }
        fetchCurrentUser()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true)
            const response = await loginApi(email, password)
            
            // Set the token first
            setAccessToken(response.accessToken)
            setAxiosToken(response.accessToken)
            
            // Then set the user
            console.log('Login user data:', response.user) // Debug log
            setCurrentUser(response.user)
        } catch (error) {
            console.error('Login error:', error)
            setAccessToken(null)
            setCurrentUser(null)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            setIsLoading(true)
            await logoutApi()
        } finally {
            setAccessToken(null)
            setCurrentUser(null)
            setIsLoading(false)
        }
    }

    const value = {
        isLoading,
        accessToken,
        currentUser,
        login,
        logout,
        fetchCurrentUser,
    }
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return context
}