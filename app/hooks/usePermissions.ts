"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export const usePermissions = () => {
  const { session } = useAuth();
  const [permissions, setPermissions] = useState<any>({
    can_add: true,
    can_edit: true,
    can_delete: false,
    can_sell: true,
  });

  useEffect(() => {
    if (!session?.user?.email) return;

    const load = async () => {
      const { data } = await supabase
        .from("staff")
        .select("permissions")
        .eq("email", session.user.email)
        .single();

      if (data?.permissions) {
        setPermissions((prev: any) => ({
          ...prev,
          ...data.permissions,
        }));
      }
    };

    load();
  }, [session]);

  return permissions;
};