export enum Role {
    Admin = "admin",
    User = "user",
    Intern = "intern"
}

export interface User {
    name: string;
    password: string;
    iconProfile?: string;
    userName: string;
    role: Role; 
}
