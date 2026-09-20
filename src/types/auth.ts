import type { ReactNode } from "react";

export interface RegisterRequest{
    name:string;
    email:string;
    password:string;
}

export interface RegisterResponse{
    userId:string;
    name:string;
    email:string;
    message:string;
}

export interface LoginRequest{
    email:string;
    password:string;
}


export interface LoginResponse{
    userId:string;
    name:string;
    email:string;
    token:string;
    
}
export interface AuthUser{
    userId:string;
    name:string;
    email:string;
    token:string;
}


export interface AuthContextType{
    user:AuthUser | null;
    isAuthenticated:boolean;
    login:(user:AuthUser)=>void;
    logout:()=>void;
    isLoading: boolean;
}

export interface AuthProviderProps{
    children:ReactNode;
}