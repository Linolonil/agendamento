export interface User {
    name: string;
    password: string;
    iconProfile?: string;
    userName: string;
    role: role;
}

enum role{
    "admin",
    "user",
    "intern"
}