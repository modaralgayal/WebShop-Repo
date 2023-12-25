export interface User {
    username: string;
    email: string; 
}

export type UserFormValues = Omit <User, "_id" | "authentication">