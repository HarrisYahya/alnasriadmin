//app/lib/roleGuard.ts
import { supabase } from "./supabaseClient";

export type Role = "admin" | "staff" | "pharmacy" | null;

export const getUserRole = async (email: string): Promise<Role> => {
  if (!email) return null;

  const { data, error } = await supabase
    .from("staff")
    .select("role")
    .eq("email", email)
    .single();

  if (error || !data) return null;

  return data.role as Role;
};