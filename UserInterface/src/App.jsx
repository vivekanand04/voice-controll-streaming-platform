

import { Navbar, Sidebar } from "./components";
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "./store/slice/authSlice"; // you need this action
const API_BASE = import.meta.env.VITE_API_URL;
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
    // Refresh token on app load
    const checkLogin = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/api/v1/account/refreshtoken`,
          {},
          { withCredentials: true }
        );
        dispatch(setUser(res.data.data.user));  
      } catch (err) {
        console.log("No active login session");
        Navigate("/login");
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

