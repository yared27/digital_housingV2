export type Price = {
  amount: number;
  period?: "daily" | "weekly" | "monthly" | "yearly";
};

export type Address = {
  state?: string;
  city?: string;
  zipCode?: string;
  street?: string;
};

export type Property = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  village?: string;
  price: Price;
  address: Address;
  amenities: string[];
  propertyImages: string[];
  ownerId?: string;
  propertyType?: "apartment" | "house" | "room" | "studio";
  isAvailable?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PropertiesListResponse = {
  data: Property[];
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number };
};
