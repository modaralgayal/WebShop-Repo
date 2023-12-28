export interface User {
    username: string;
    email: string;
    basket: Array<string | any>
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