export interface RegisterUserRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    role: 'customer' | 'shop';
}

export interface LoginUserRequest {
    email: string;
    password: string;
}
