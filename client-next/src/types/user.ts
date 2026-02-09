export interface IUser {
    fullName: string;
    email: string;
    role: 'renter'|'owner'|'admin';
    isAccountVerified: boolean;
    googleId?: string;
    avatar?: string;
    rating?: number;
    reports?: string[];
    password?: string;
    isUserIdentityVerified?: boolean;
}