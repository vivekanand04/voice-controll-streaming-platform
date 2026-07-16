

import { Navbar, Sidebar } from "./components";
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import "./api/axios"; 
import { useDispatch } from "react-redux";
import { LOGOUT_MARKER_KEY, setAuth } from "./store/slice/authSlice";
const API_BASE = import.meta.env.VITE_API_URL;

const getJwtPayload = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    return payload ? JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) : null;
  } catch (error) {
    return null;
  }
};

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
 
  useEffect(() => {
    // Sidebar auto-resize
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Refresh token on app load - don't redirect on failure, just set user if successful
    const checkLogin = async () => {
      if (localStorage.getItem(LOGOUT_MARKER_KEY)) return;

      try {
        const res = await axios.post(
          `${API_BASE}/api/v1/account/refreshtoken`,
          {},
          { withCredentials: true }
        );
        const tokens = res.data?.data || {};
        const userId = getJwtPayload(tokens.accessToken)?._id;
        if (!userId) return;

        const userRes = await axios.get(`${API_BASE}/api/v1/account/userData/${userId}`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
          withCredentials: true,
        });

        dispatch(setAuth({
          user: userRes.data?.data,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }));
      } catch (err) {
        // User is not logged in - this is fine, don't redirect
        console.log("No active login session");
      }
    };

    checkLogin();
  }, [dispatch]);

  return (
    <>
      <Navbar openChange={() => setIsOpen(prev => !prev)} />
      <div className={`flex pt-8 overflow-hidden bg-gray-50`}>
        <Sidebar hidden={isOpen} />
        {/* <-- CHANGE: when sidebar is closed (isOpen === false) apply mx-5 (20px left+right).
            when sidebar is open keep lg left margin to make room for the sidebar */}
        <div
          id="main-content"
          className={`relative w-full h-full overflow-y-auto bg-gray-50 ${isOpen ? "lg:ml-52" : "md:mx-16"}`}
        >
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
