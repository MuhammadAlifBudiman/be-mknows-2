import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import asyncHandler from "express-async-handler";

import { User } from "@interfaces/user.interface";
import { UserService } from "@services/users.service";
import { apiResponse } from "@/utils/apiResponse";
import { getUserAgent } from "@utils/userAgent";
import { UserAgent } from "@/interfaces/common/useragent.interface";
// import { CreateUserDto } from "@dtos/users.dto";

export class UserController {
  public user = Container.get(UserService);

  public getUseragent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userAgentPayload: UserAgent = getUserAgent(req);
    res.status(200).json(apiResponse(200, "OK", "All Users Retrieved", userAgentPayload));
  });

  public getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const findAllUsersData: User[] = await this.user.findAllUser();

    res.status(200).json(apiResponse(200, "OK", "All Users Retrieved", findAllUsersData));
  });

  public getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id);
    const findOneUserData: User = await this.user.findUserById(userId);

    res.status(200).json({ data: findOneUserData, message: "findOne" });
  });

  // public createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //   const userData: CreateUserDto = req.body;
  //   const createUserData: User = await this.user.createUser(userData);

  //   res.status(201).json({ data: createUserData, message: "created" });
  // });

  // public updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId = Number(req.params.id);
  //     const userData: CreateUserDto = req.body;
  //     const updateUserData: User = await this.user.updateUser(userId, userData);

  //     res.status(200).json({ data: updateUserData, message: "updated" });
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  // public deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId = Number(req.params.id);
  //     const deleteUserData: User = await this.user.deleteUser(userId);

  //     res.status(200).json({ data: deleteUserData, message: "deleted" });
  //   } catch (error) {
  //     next(error);
  //   }
  // });
}