import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://chat-app-1ta0.onrender.com/api',
    withCredentials: true
})