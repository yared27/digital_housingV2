import type { Property } from "@/types/property";

type BookingUser = {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
};

export type Booking = {
  _id?: string;
  id?: string;
  propertyId: string | Property;
  ownerId?: string | BookingUser;
  renterId?: string | BookingUser;
  startDate: string;
  endDate: string;
  status?: 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';
  paymentStatus?: "pending" | "paid" | "refunded";
  totalPrice?: number;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BookingsListResponse = {
  data: Booking[];
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number };
};
