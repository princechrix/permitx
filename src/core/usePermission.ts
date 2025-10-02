import { useState, useEffect } from "react";
import { usePermissionResolver } from "./PermissionProvider";
import type { User } from "../types";

export const usePermission = () => {
  const resolver = usePermissionResolver();
  const [user, setUser] = useState<User>({ permissions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = resolver();
    if (result instanceof Promise) {
      result.then((u) => {
        setUser(u);
        setLoading(false);
      });
    } else {
      setUser(result);
      setLoading(false);
    }
  }, [resolver]);

  const hasRole = (role: string) => user?.role === role;
  const hasPermission = (perm: string) => user?.permissions?.includes(perm);

  return { user, hasRole, hasPermission, loading };
};
