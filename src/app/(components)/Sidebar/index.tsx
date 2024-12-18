"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Armchair,
  Building,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  Scale,
  Shield,
  SlidersHorizontal,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_ROUTES } from "@/utils/authorization";
import { useSelector } from "react-redux";
import { selectSetting } from "@/state/settingSlice";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

// Definisikan mapping icon dan label untuk setiap route
const SIDEBAR_ROUTES = {
  "/dashboard": { icon: Layout, label: "Dashboard" },
  "/agencies": { icon: Building, label: "Instansi" },
  "/queues": { icon: Clipboard, label: "Antrian" },
  "/regulation": { icon: Scale, label: "Regulasi" },
  "/facilities": { icon: Armchair, label: "Fasilitas" },
  "/roles": { icon: Shield, label: "Roles" },
  "/users": { icon: User, label: "Users" },
  "/settings": { icon: SlidersHorizontal, label: "Settings" },
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const setting = useSelector(selectSetting);
  const { user } = useAppSelector((state) => state.auth);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // Dapatkan routes yang diizinkan berdasarkan role
  const allowedRoutes = user?.nama_role
    ? ROLE_ROUTES[user.nama_role] || []
    : [];

  // Filter routes berdasarkan role
  const filteredRoutes = Object.keys(SIDEBAR_ROUTES).filter((route) =>
    allowedRoutes.some((allowedRoute) =>
      new RegExp(`^${allowedRoute.replace("*", ".*")}$`).test(route)
    )
  );

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <div>
          {setting.logo ? (
            <Image
              src={setting.logo}
              alt={"MPP Logo"}
              width={120}
              height={120}
              className="mr-4"
            />
          ) : (
            <Image
              src={"/assets/logo/MPP.png"}
              alt={"MPP Logo"}
              width={120}
              height={120}
              className="mr-4"
            />
          )}
        </div>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        {filteredRoutes.map((route) => {
          const { icon: Icon, label } =
            SIDEBAR_ROUTES[route as keyof typeof SIDEBAR_ROUTES];

          return (
            <SidebarLink
              key={route}
              href={route}
              icon={Icon}
              label={label}
              isCollapsed={isSidebarCollapsed}
            />
          );
        })}
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">{setting.versi}</p>
        <p className="text-center text-xs text-gray-500">{setting.footer}</p>
      </div>
    </div>
  );
};

export default Sidebar;
