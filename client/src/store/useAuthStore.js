import {create} from 'zustand';
import { toast } from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js';
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) =>({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    checkAuth: async()=>{
        try {
            const response = await axiosInstance.get("/auth/check");
            set({authUser: response.data});
            get().connectSocket();
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
            toast.error(error.message);
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
            toast.error("An error occurred.");
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
            get().disconnectSocket();
        } catch (error) {
            console.log(error.message);
            toast.error("An error occurred.");
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile: true});
        try {
            const response = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: response.data});
            toast.success("Profile Picture Updated");
        } catch (error) {
            console.log(error.message);
            toast.error("An error occurred.");
        }
        finally{
            set({isUpdatingProfile: false});
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
    
        set({ socket: socket });
    
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}))