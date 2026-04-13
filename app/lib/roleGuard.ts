import { supabase } from "./supabaseClient";

export const getUserRole = async (email: string) => {
  const { data } = await supabase
    .from("staff")
    .select("role")
    .eq("email", email)
    .single();

  return data?.role || "admin";
};