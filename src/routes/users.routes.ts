import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import { UserController } from "@controllers/users.controller";
import { AuthMiddleware, AuthorizedRoles } from "@middlewares/auth.middleware";
import Limitter from "@middlewares/rate-limitter.middleware";
// import { ValidationMiddleware } from "@middlewares/validation.middleware";
// import { CreateUserDto } from "@dtos/users.dto";

export class UserRoute implements Routes {
  public path = "users";
  public router = Router();
  public user = new UserController();
  public limitter = new Limitter();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/v1/users/check`, this.user.getUseragent);
    this.router.get(`/v1/${this.path}`, 
      this.limitter.default(), 
      AuthMiddleware, AuthorizedRoles(["ADMIN"]), 
      this.user.getUsers
    );
    this.router.get(`/v1/${this.path}/:id`, this.user.getUserById);
    // this.router.post(`/v1/${this.path}`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    // this.router.put(`/v1/${this.path}/:id`, ValidationMiddleware(CreateUserDto, true), this.user.updateUser);
    // this.router.delete(`/v1/${this.path}/:id`, this.user.deleteUser);
  }
}