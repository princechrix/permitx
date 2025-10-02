import React from "react";
import { usePermission } from "../core/usePermission";

export const IfRole = ({
  role,
  children,
  fallback = null
}: {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { hasRole, loading } = usePermission();

  if (loading) return null;

  return hasRole(role) ? <>{children}</> : <>{fallback}</>;
};
