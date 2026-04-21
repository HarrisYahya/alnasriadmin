"use client";

import { ReactNode } from "react";
import { usePermissions } from "../hooks/usePermissions";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  permission: string;
};

export default function RoleView({ children, fallback = null, permission }: Props) {
  const { can } = usePermissions();

  if (!can(permission as any)) return <>{fallback}</>;

  return <>{children}</>;
}