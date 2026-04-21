"use client";

import { useRole } from "./useRole";
import { hasPermission, Permission } from "../lib/permissions";

export const usePermissions = () => {
  const { role } = useRole();

  const can = (permission: Permission) => {
    return hasPermission(role, permission);
  };

  return { role, can };
};