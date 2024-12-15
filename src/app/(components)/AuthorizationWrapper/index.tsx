// components/AuthorizationWrapper.tsx
"use client";

import { ReactNode } from "react";
import { useRouteAuthorization } from "@/hooks/useAuthorization";
import LoadingSpinner from "../LoadingSpinner";

interface AuthorizationWrapperProps {
  children: ReactNode;
}

export const AuthorizationWrapper: React.FC<AuthorizationWrapperProps> = ({
  children,
}) => {
  const { isAuthorized } = useRouteAuthorization();

  // Tampilkan loading atau null selama pengecekan
  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
};
