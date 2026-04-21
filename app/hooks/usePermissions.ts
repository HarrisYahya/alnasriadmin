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
    const load = async () => {
      const email = session?.user?.email;
      if (!email) return;

      const { data } = await supabase
        .from("staff")
        .select("permissions")
        .eq("email", email)
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