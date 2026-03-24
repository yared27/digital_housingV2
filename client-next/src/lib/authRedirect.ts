export type UserRole = "renter" | "owner" | "admin";

const roleRedirectMap: Record<UserRole, string> = {
  renter: "/bookings",
  owner: "/owner/properties",
  admin: "/admin",
};

export function getRoleRedirectPath(role?: string | null): string {
  if (role === "owner" || role === "admin" || role === "renter") {
    return roleRedirectMap[role];
  }
  return roleRedirectMap.renter;
}