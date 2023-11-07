export interface User {
  pk?: number;
  uuid?: string;
  
  full_name?: string;
  display_picture?: number | string;
  email: string;
  password?: string;
}

export interface UserResponse extends Omit<User, "password"> {}