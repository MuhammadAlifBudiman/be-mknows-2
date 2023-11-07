import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import asyncHandler from "express-async-handler";

import { AuthService } from "@services/auth.service";

import { User, UserResponse } from "@interfaces/user.interface";
import { RequestWithUser } from "@interfaces/authentication/token.interface";
import { UserAgent } from "@interfaces/common/useragent.interface";

import { CreateUserDto } from "@dtos/users.dto";

import { getUserAgent } from "@utils/userAgent";
import { apiResponse } from "@utils/apiResponse";

export class AuthController {
  private auth = Container.get(AuthService);

  public signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    const signUpUserData: UserResponse = await this.auth.signup(userData);

    res.status(201).json(apiResponse(201, "OK", "Register Success", signUpUserData));
  });

  public logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userAgentPayload: UserAgent = getUserAgent(req);
    const userData: CreateUserDto = req.body;
    
    const { cookie, accessToken } = await this.auth.login(userData, userAgentPayload);

    res.setHeader("Set-Cookie", [cookie]);
    res.status(200).json(apiResponse(200, "OK", "Login Success", { access_token: accessToken }));
  });

  public logOut = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user;
    const userSessionId: string = req.session_id;

    await this.auth.logout(userData, userSessionId);

    res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
    res.status(200).json(apiResponse(200, "OK", "Logout Success", {}));
  });
}