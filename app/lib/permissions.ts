export type Role = "admin" | "staff" | "pharmacy";

export type Permission =
  | "queue_add"
  | "queue_talk"
  | "queue_done"
  | "queue_delete";

const rolePermissions: Record<Role, Permission[]> = {
  admin: ["queue_add", "queue_talk", "queue_done", "queue_delete"],

  staff: [
    "queue_add",
    "queue_done"
    // admin can change this later
  ],

  pharmacy: [],
};

export const hasPermission = (
  role: string | null | undefined,
  permission: Permission
) => {
  if (!role) return false;
  if (!(role in rolePermissions)) return false;

  return rolePermissions[role as Role].includes(permission);
};