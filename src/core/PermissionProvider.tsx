import React, { createContext, useContext } from "react";
import type { Resolver, User } from "../types";

const PermissionContext = createContext<Resolver | null>(null);

export const PermissionProvider = ({
  resolver,
  children
}: {
  resolver: Resolver;
  children: React.ReactNode;
}) => {
  return (
    <PermissionContext.Provider value={resolver}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionResolver = (): Resolver => {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermissionResolver must be used within PermissionProvider");
  return ctx;
};
