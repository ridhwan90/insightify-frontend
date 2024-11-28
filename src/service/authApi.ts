import axios from 'axios'

export type authUser = {
    cuid: string,
    firstName: string,
    lastName: string,
    email: string,
    picture?: string | null
}

export type LoginResponse = {
    accessToken: string,
    user: authUser
}

export type OTPPurpose = 'VERIFY_EMAIL' | 'RESET_PASSWORD'

interface ValidateOTPResponse {
    message: string;
    resetToken?: string;
    expiresAt?: string;
    error?: string;
}

interface VerifyResetTokenResponse {
    valid: boolean;
    email: string;
    error?: string;
}

const BASE_URL = 'https://insightify-server.ridhwan-saberi.workers.dev/api'
// const BASE_URL = 'http://localhost:8787/api'
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export function setAxiosToken(token: string | null) {
    console.log('Setting axios token:', token);
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
        console.log('Axios headers after setting:', axiosInstance.defaults.headers.common);
    } else {
        delete axiosInstance.defaults.headers.common['Authorization']
        console.log('Removed Authorization header from axios');
    }
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
    console.log('Attempting login with email:', email);
    const res = await axiosInstance.post<LoginResponse>('/login', {
        email,
        password,
    }, {
        withCredentials: true
    })
    
    console.log('Login API raw response:', res);
    
    if (res.status !== 200) {
        console.error('Login failed with status:', res.status);
        throw new Error('Login failed')
    }

    console.log('Login API successful response:', res.data);
    if (!res.data.accessToken) {
        console.error('No access token in response');
        throw new Error('No access token received');
    }
    return res.data
}

export async function registerApi(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    const res = await axiosInstance.post('/register', {
        firstName,
        lastName,
        email,
        password,
    }, {
        withCredentials: true
    })
    
    if (res.status !== 201) {
        throw new Error('Registration failed')
    }
}

export async function validateSession(): Promise<authUser> {
    console.log('Validating session with headers:', axiosInstance.defaults.headers.common);
    const res = await axiosInstance.get<authUser>('/validate-session', {
        withCredentials: true
    })
    
    console.log('Validate session response:', res);
    
    if (res.status !== 200) {
        console.error('Session validation failed with status:', res.status);
        throw new Error('Session validation failed')
    }

    return res.data
}

export async function logoutApi(): Promise<void> {
    await axiosInstance.get('/logout', {
        withCredentials: true
    })
}

export async function refreshToken(): Promise<{ accessToken: string }> {
    console.log('Attempting to refresh token');
    try {
        const res = await axiosInstance.get<{ accessToken: string }>('/refresh', {
            withCredentials: true,
            headers: {
                'Accept': 'application/json'
            }
        })
        
        console.log('Refresh token response:', res);
        
        if (res.status !== 200) {
            console.error('Refresh token failed with status:', res.status);
            throw new Error('Token refresh failed')
        }

        if (!res.data.accessToken) {
            console.error('No access token in refresh response');
            throw new Error('No access token in refresh response');
        }

        console.log('Successfully refreshed token');
        return res.data
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

export async function changePassword(password: string): Promise<void> {
    const res = await axiosInstance.put('/password', { 
        password 
    }, {
        withCredentials: true
    })
    
    if (res.statusText !== 'OK') {
        throw new Error('Password change failed')
    }
}

export async function checkEmailExists(email: string): Promise<boolean> {
    const res = await axiosInstance.get<{ exists: boolean }>(`/check-email`, {
        params: { email }
    })
    return res.data.exists
}

export async function generateOTP(email: string, purpose: OTPPurpose): Promise<void> {
    const res = await axiosInstance.post('/generate-otp', {
        email,
        purpose
    })
    
    if (res.status !== 200) {
        throw new Error('Failed to generate OTP')
    }
}

export async function validateOTP(email: string, code: string, purpose: OTPPurpose): Promise<ValidateOTPResponse> {
    const res = await axiosInstance.post<ValidateOTPResponse>('/validate-otp', {
        email,
        code,
        purpose
    })
    
    if (res.status !== 200) {
        const data = res.data;
        throw new Error(data.error || 'Failed to validate OTP');
    }

    return res.data;
}

export async function verifyResetToken(resetToken: string): Promise<VerifyResetTokenResponse> {
    const res = await axiosInstance.post<VerifyResetTokenResponse>('/verify-reset-token', {
        resetToken
    });
    
    if (res.status !== 200) {
        const data = res.data;
        throw new Error(data.error || 'Failed to verify reset token');
    }

    return res.data;
}

export async function resetPassword(email: string, password: string, resetToken: string): Promise<void> {
    const res = await axiosInstance.post('/reset-password', {
        email,
        password,
        resetToken
    });
    
    if (res.status !== 200) {
        const data = res.data;
        throw new Error(data.error || 'Failed to reset password');
    }
}