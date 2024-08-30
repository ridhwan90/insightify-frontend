import axios from 'axios'

type authUser = {
    cuid: string,
    firstName: string,
    lastName: string,
    email: string
}

const BASE_URL = 'http://localhost:8787/api'
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

export async function loginApi(email: string, password: string) {
    const res = await axiosInstance.post('/login', {
        email,
        password,
    },{
        withCredentials: true
    })
    if (res.status !== 200) {
        throw new Error('Login failed')
    }
}

export async function registerApi(firstName: string, lastName: string, email: string, password: string) {
    const res = await axiosInstance.post('/register', {
        firstName,
        lastName,
        email,
        password,
    },{
        withCredentials: true
    })
    if (res.status !== 201) {
        throw new Error('Registration failed')
    }
}

export async function validateSession(): Promise<authUser> {
   const res = await axiosInstance.get('/validate-session', {
        withCredentials: true
    })
    if (res.statusText !== 'OK') {
        throw new Error('Session validation failed')
    }

    return res.data
}

export async function logout() {
    await axiosInstance.get('/logout', {
        withCredentials: true
    })
}