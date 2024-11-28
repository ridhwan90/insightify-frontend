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
    const res = await axiosInstance.post<LoginResponse>('/login', {
        email,
        password,
    }, {
        withCredentials: true
    })
    
    if (res.status !== 200) {
        throw new Error('Login failed')
    }

    console.log('Login API response:', res.data);
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
    const res = await axiosInstance.get<authUser>('/validate-session', {
        withCredentials: true
    })
    
    if (res.statusText !== 'OK') {
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
    const res = await axiosInstance.get<{ accessToken: string }>('/refresh', {
        withCredentials: true
    })
    
    if (res.statusText !== 'OK') {
        throw new Error('Token refresh failed')
    }

    return res.data
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