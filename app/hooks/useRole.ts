//app/hooks/useRole.ts
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserRole, Role } from "../lib/roleGuard";

export const useRole = () => {
  const { session } = useAuth();
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const email = session?.user?.email;

      if (!email) {
        setRole(null);
        setLoading(false);
        return;
      }

      const userRole = await getUserRole(email);
      setRole(userRole);
      setLoading(false);
    };

    load();
  }, [session]);

  return { role, loading };
};