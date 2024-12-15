"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { logout } from "@/state/authSlice"; // Import logout action
import { HOST_PORTAL } from "@/utils/constants";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Selector untuk mendapatkan state global dan auth
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkmode);

  // Selector untuk mendapatkan data user
  const user = useAppSelector((state) => state.auth.user);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  // Fungsi logout
  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logout());

    // Redirect ke halaman login
    router.push(HOST_PORTAL);
  };

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          {/* <div>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="cursor-pointer text-gray-500" />
              ) : (
                <Moon className="cursor-pointer text-gray-500" />
              )}
            </button>
          </div>
          <div className="relative">
            <Bell className="cursor-pointer text-gray-500" size={24} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
              3
            </span>
          </div> */}

          <hr className="w-0 h-7 border border-solid border-l border=gray-300 mx-3" />

          {/* User Info and Logout */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.nama_lengkap
                ? user.nama_lengkap.charAt(0).toUpperCase()
                : "U"}
            </div>
            <span className="font-semibold">
              {user?.nama_lengkap || "User"}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
