"use client";

import { ReactNode } from "react";
import { useRole } from "../hooks/useRole";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: ReactNode;
  allowed: ("admin" | "staff" | "pharmacy")[];
};

export default function ProtectedRoute({ children, allowed }: Props) {
  const { session } = useAuth();
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <div>Unauthorized</div>;
  }

  if (!role || !allowed.includes(role)) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
}