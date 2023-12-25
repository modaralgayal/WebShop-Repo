export interface User {
    username: string;
    email: string; 
}

export interface LoginValue {
    email: string,
    password: string
}

export interface CreatorValues {
    email: string,
    username: string,
    password: string
}

export type UserFormValues = Omit <User, "_id" | "authentication">