// utils/authorization.ts
export const ROLE_ROUTES: Record<string, string[]> = {
  SUPERADMIN: [
    "/dashboard",
    "/agencies",
    "/agencies/*",
    "/agencies/*/*",
    "/facilities",
    "/facilities/*",
    "/facilities/*/*",
    "/queues",
    "/queues/*",
    "/queues/*/*",
    "/regulation",
    "/regulation/*",
    "/regulation/*/*",
    "/roles",
    "/roles/*",
    "/roles/*/*",
    "/users",
    "/users/*",
    "/users/*/*",
    "/settings",
  ],
  RECEPTIONIST: [
    "/dashboard",
    "/agencies",
    "/agencies/*",
    "/agencies/*/*",
    "/facilities",
    "/facilities/*",
    "/facilities/*/*",
    "/queues",
    "/queues/*",
    "/queues/*/*",
    "/regulation",
    "/regulation/*",
    "/regulation/*/*",
  ],
  OPERATOR: ["/dashboard", "/queues", "/queues/*", "/queues/*/*"],
};

export const checkRouteAccess = (role: string, pathname: string): boolean => {
  const allowedRoutes = ROLE_ROUTES[role] || [];

  return allowedRoutes.some((route) => {
    // Konversi pola route ke regex
    const routePattern = route.replace("*", ".*");
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(pathname);
  });
};
