import React from "react";
import { usePermission } from "../core/usePermission";

export const IfPermission = ({
  permission,
  children,
  fallback = null
}: {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { hasPermission, loading } = usePermission();

  if (loading) return null;

  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
};
