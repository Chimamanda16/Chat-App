import {create} from 'zustand';
import { toast } from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js';

export const useAuthStore = create((set) =>({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,
    isUpdatingProfile: false,
    signUp: async(data)=>{
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
          } catch (error) {
            toast.error(error.response.data.message);
          } finally {
            set({ isSigningUp: false });
          }
    },
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