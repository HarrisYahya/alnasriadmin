export type Role = "admin" | "staff" | "pharmacy";

export type Permission =
  | "view_dashboard"
  | "add_patient"
  | "view_patients"
  | "view_queue"
  | "manage_queue"
  | "view_pharmacy"
  | "manage_pharmacy"
  | "view_settings";

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "view_dashboard",
    "add_patient",
    "view_patients",
    "view_queue",
    "manage_queue",
    "view_pharmacy",
    "manage_pharmacy",
    "view_settings",
  ],

  staff: [
    "view_dashboard",
    "add_patient",
    "view_queue",
    "manage_queue",
  ],

  pharmacy: [
    "view_dashboard",
    "view_pharmacy",
    "manage_pharmacy",
  ],
};

// 🔥 SAFE FUNCTION (THIS IS THE KEY FIX)
export const hasPermission = (
  role: string | null | undefined,
  permission: Permission
) => {
  if (!role) return false;

  // Convert unsafe string → safe Role
  if (role !== "admin" && role !== "staff" && role !== "pharmacy") {
    return false;
  }

  return rolePermissions[role].includes(permission);
};