export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface SignupResponse {
  user: {
    _id?: string;
    id?: string;
    fullName: string;
    email: string;
    role: "renter" | "owner" | "admin";
  };
}
