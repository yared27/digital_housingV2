export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface SignupResponse {
  id: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
