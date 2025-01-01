import { type authUser, loginApi, logoutApi, refreshToken, setAxiosToken, validateSession, handleGoogleCallback } from "@/service/authApi"
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
    setAccessToken: (token: string | null) => void
    setCurrentUser: (user: authUser | null) => void
}

const AuthContext = createContext<AuthContext | undefined>(undefined)

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

export default function AuthProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState(true)
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            console.log('Found token in localStorage, setting in axios:', token);
            setAxiosToken(token);
        } else {
            console.log('No token found in localStorage');
            setAxiosToken(null);
        }
        console.log('Initial token from localStorage:', token);
        return token;
    })
    const [currentUser, setCurrentUser] = useState<authUser | null>(null)

    // Set up axios interceptor for token refresh
    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as ExtendedAxiosRequestConfig;
                console.log('Response error intercepted:', error.response?.status);

                if (!originalRequest || !error.response) {
                    return Promise.reject(error);
                }

                // If the error is 403 and we haven't retried yet
                if (error.response.status === 403 && !originalRequest._retry) {
                    console.log('Attempting to refresh token due to 403 error');
                    originalRequest._retry = true;

                    try {
                        // Try to refresh the token
                        const response = await refreshToken();
                        const newToken = response.accessToken;
                        console.log('Token refresh successful, updating token');

                        // Update the token in state and axios
                        localStorage.setItem('accessToken', newToken);
                        setAccessToken(newToken);
                        setAxiosToken(newToken);

                        // Retry the original request with new token
                        if (originalRequest.headers) {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        }
                        return axiosInstance(originalRequest);
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        // If refresh fails, clear everything
                        localStorage.removeItem('accessToken');
                        setAccessToken(null);
                        setCurrentUser(null);
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [])

    // Update axios token when accessToken changes
    useEffect(() => {
        if (accessToken) {
            console.log('Setting token in localStorage:', accessToken);
            localStorage.setItem('accessToken', accessToken)
            setAxiosToken(accessToken)
        } else {
            console.log('Removing token from localStorage');
            localStorage.removeItem('accessToken')
            setAxiosToken(null)
        }
    }, [accessToken])

    const fetchCurrentUser = async () => {
        try {
            setIsLoading(true)
            const user = await validateSession()
            setCurrentUser(user)
        } catch (error) {
            console.error('Fetch user error:', error)
            // Only clear token if it's not the initial load
            if (currentUser !== null) {
                console.log('Clearing token due to validation error');
                setCurrentUser(null)
                setAccessToken(null)
                setAxiosToken(null)
            } else {
                console.log('Initial validation failed, keeping token for retry');
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch user on mount and handle token from localStorage
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            console.log('Setting token on mount:', token);
            setAxiosToken(token);
        } else {
            console.log('No token found on mount');
            setAxiosToken(null);
        }
        fetchCurrentUser()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            console.log('Starting login process...');
            setIsLoading(true)
            const response = await loginApi(email, password)
            
            // Set the token first
            console.log('Login successful, received tokens:', response.accessToken, response.refreshToken);
            
            try {
                console.log('Attempting to save tokens to localStorage');
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                console.log('Tokens saved to localStorage');
                
                console.log('Setting token in axios');
                setAxiosToken(response.accessToken); // Set in axios first
                
                console.log('Updating access token state');
                setAccessToken(response.accessToken); // Then update state
                
                // Then set the user
                console.log('Setting user data:', response.user);
                setCurrentUser(response.user);
            } catch (storageError) {
                console.error('Error saving to localStorage:', storageError);
                throw storageError;
            }
        } catch (error) {
            console.error('Login error:', error);
            setAccessToken(null);
            setCurrentUser(null);
            throw error;
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            setIsLoading(true)
            console.log('Starting logout process');
            
            // Clear localStorage first
            console.log('Clearing localStorage');
            localStorage.clear(); // Clear all storage just to be safe
            
            // Clear axios headers
            console.log('Clearing axios headers');
            setAxiosToken(null);
            
            // Call logout API to clear cookies
            await logoutApi()
            console.log('Logout API successful');
            
            // Clear all state
            setAccessToken(null)
            setCurrentUser(null)
            
            // Small delay to ensure cleanup is complete
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Force a hard reload to clear any remaining state
            window.location.replace('/login');
        } catch (error) {
            console.error('Logout error:', error)
            // Still clear everything even if API call fails
            localStorage.clear();
            setAxiosToken(null);
            setAccessToken(null)
            setCurrentUser(null)
            window.location.replace('/login');
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleRedirect = async () => {
        try {
            setIsLoading(true);
            await handleGoogleCallback();
            await fetchCurrentUser(); // Get the user data after setting the token
        } catch (error) {
            console.error('Error handling Google redirect:', error);
            setAccessToken(null);
            setCurrentUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Check if we're on the dashboard page after Google redirect
    useEffect(() => {
        const isAfterGoogleRedirect = window.location.pathname === '/dashboard' && 
                                    !accessToken && 
                                    document.cookie.includes('refreshToken');
        
        if (isAfterGoogleRedirect) {
            console.log('Detected Google redirect, handling authentication');
            handleGoogleRedirect().catch(console.error);
        }
    }, []);

    const value = {
        isLoading,
        accessToken,
        currentUser,
        login,
        logout,
        fetchCurrentUser,
        setAccessToken,
        setCurrentUser
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
