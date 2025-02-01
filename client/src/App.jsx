import { useEffect } from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import NavbarComp from "./components/Navbar";
import HompageComp from "./pages/HomePage.jsx";
import SignupPageComp from "./pages/SignupPage";
import LoginPageComp from "./pages/LoginPage";
import SettingsPageComp from "./pages/SettingsPage";
import ProfilePageComp from "./pages/ProfilePage";

function App() {

  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  console.log(onlineUsers);

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <NavbarComp />
      <Routes>
        <Route path="/" element={authUser ? <HompageComp /> : <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignupPageComp/> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPageComp /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPageComp />} />
        <Route path="/profile" element={authUser ? <ProfilePageComp /> : <Navigate to="/login"/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
