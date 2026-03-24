export interface IUser {
    _id?: string;
    id?: string;
    fullName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    address?: {
        country?: string;
        city?: string;
        postalCode?: string;
    };
    role: 'renter'|'owner'|'admin';
    isAccountVerified: boolean;
    googleId?: string;
    avatar?: string;
    rating?: number;
    reports?: string[];
    password?: string;
    isUserIdentityVerified?: boolean;
}