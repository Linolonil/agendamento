export interface User {
    name: string;
    password: string;
    iconProfile?: string;
    userName: string;
    role: "admin" | "user" | "intern";
}

