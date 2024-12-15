// hooks/useRouteAuthorization.ts
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/app/redux";
import { checkRouteAccess } from "@/utils/authorization";

export const useRouteAuthorization = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Cek autentikasi
    if (!token) {
      router.push("/");
      return;
    }

    // Cek role dan akses route
    if (user && user.nama_role) {
      const hasAccess = checkRouteAccess(user.nama_role, pathname);

      if (!hasAccess) {
        // Redirect ke dashboard jika tidak punya akses
        router.push("/dashboard");
      }

      setIsAuthorized(hasAccess);
    } else {
      // Jika tidak ada user/role, redirect ke login
      router.push("/");
    }
  }, [user, token, pathname, router]);

  return {
    isAuthorized,
    userRole: user?.nama_role,
  };
};
