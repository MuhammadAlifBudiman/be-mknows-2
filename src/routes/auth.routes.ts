import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import { AuthController } from "@controllers/auth.controller";

import { AuthMiddleware } from "@middlewares/auth.middleware";
import { ValidationMiddleware } from "@middlewares/validation.middleware";

import { CreateUserDto, LoginUserDto } from "@dtos/users.dto";

export class AuthRoute implements Routes {
  public path = "auth";
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/v1/${this.path}/register`, ValidationMiddleware(CreateUserDto), this.auth.signUp);
    this.router.post(`/v1/${this.path}/login`, ValidationMiddleware(LoginUserDto), this.auth.logIn);
    this.router.post(`/v1/${this.path}/logout`, AuthMiddleware, this.auth.logOut);
  }
}