import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';

export const useAuthStore = create((set) =>({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,
    isUpdatingProfile: false,
    checkAuth: ()=>{
        try {
            const response = axiosInstance.get("/auth/check");
            set({authUser: response.data});
        } catch (error) {
            console.error(error.message);
            set({authUser: null});
        }
        finally{
            set({isCheckingAuth: false});
        }
    }
}))