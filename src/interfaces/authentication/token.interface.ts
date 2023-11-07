import { Request } from "express";
import { User } from "@interfaces/user.interface";

export interface DataStoredInToken {
  sid?: string; // user session uuid 
  uid: string; // user uuid

  iat?: number;
  exp?: number;
}

export interface TokenPayload {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  session_id: string;
  user: User;
  user_roles: string[];
}