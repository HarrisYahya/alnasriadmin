"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRole } from "../hooks/useRole";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
  allowed?: ("admin" | "staff" | "pharmacy")[];
};

export default function ProtectedRoute({ children, allowed }: Props) {
  const { session } = useAuth();
  const { role, loading } = useRole();
  const router = useRouter();

  const redirected = useRef(false);

  useEffect(() => {
    if (loading || redirected.current) return;

    if (!session) {
      redirected.current = true;
      router.replace("/login");
      return;
    }

    if (!role || (allowed && !allowed.includes(role))) {
      redirected.current = true;
      router.replace("/");
    }
  }, [session, role, loading, router, allowed]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}