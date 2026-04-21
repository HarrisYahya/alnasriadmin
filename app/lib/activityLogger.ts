import { supabase } from "./supabaseClient";

export const logActivity = async ({
  action,
  description,
  user_email,
}: {
  action: string;
  description: string;
  user_email?: string;
}) => {
  try {
    await supabase.from("activity_logs").insert({
      action,
      description,
      user_email,
    });
  } catch (e) {
    console.error("Activity log error", e);
  }
};