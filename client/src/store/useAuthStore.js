import {create} from 'zustand';
import { toast } from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js';

export const useAuthStore = create((set) =>({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,
    checkAuth: async()=>{
        try {
            const response = await axiosInstance.get("/auth/check");
            set({authUser: response.data});
        } catch (error) {
            console.error("Error in checkAuth", error.message);
            set({authUser: null});
        }
        finally{
            set({isCheckingAuth: false});
        }
    },
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
    login: async(data)=>{
        set({isLoggingIn: true});
        try {
            const response = await axiosInstance.post("/auth/login", data);
            console.log(response)
            set({authUser: response.data});
            toast.success("Logged in successfully");
        } catch (error) {
            console.log(error.message);
        }
        finally{
            set({isLoggingIn: false});
        }
    },
    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
        } catch (error) {
            console.log(error.message);
            toast.error("An error occurred.", error.message);
        }
    }
}))