export interface Role {
  pk: number;
  uuid: string;

  name: string;
}

export interface UserRole {
  role?: Role;
  
  user_id: number;
  role_id: number;
}