import { User } from "@inventory/user/domain";

export interface RegisterDTO {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenDTO {
    refreshToken: string;
}
