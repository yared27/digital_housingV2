import type { IUser } from "@/types/user";

export type DashboardRole = "renter" | "owner" | "admin";

export type NavItem = {
  label: string;
  href: string;
};

const renterNav: NavItem[] = [
  { label: "Properties", href: "/properties" },
  { label: "My Bookings", href: "/bookings" },
  { label: "Profile", href: "/profile" },
];

const ownerNav: NavItem[] = [
  { label: "My Properties", href: "/owner/properties" },
  { label: "Booking Requests", href: "/owner/bookings" },
  { label: "Profile", href: "/profile" },
];

const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Properties", href: "/admin/properties" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Reports", href: "/admin/reports" },
];

export function getDashboardRole(user?: IUser | null): DashboardRole {
  if (user?.role === "owner" || user?.role === "admin" || user?.role === "renter") {
    return user.role;
  }
  return "renter";
}

export function getNavItemsForRole(role: DashboardRole): NavItem[] {
  if (role === "admin") return adminNav;
  if (role === "owner") return ownerNav;
  return renterNav;
}
