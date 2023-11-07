import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { User } from "@interfaces/user.interface";
import { UserSession } from "@interfaces/user-session.interface";
import { RequestWithUser } from "@interfaces/authentication/token.interface";
import { UpdateUserProfileDto } from "@dtos/account.dto";

import { AccountService } from "@services/account.service";
import { apiResponse } from "@utils/apiResponse";

export class AccountController {
  private account = Container.get(AccountService);

  public getMyProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const user: User = await this.account.getProfileByUserId(user_id);

    res.status(200).json(apiResponse(200, "OK", "Get Profile Success", user));
  });

  public getMySessionsHistories = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const session_id = req.session_id;
    const userSessions: UserSession[] = await this.account.getSessionsHistoriesByUserId(user_id, session_id);

    res.status(200).json(apiResponse(200, "OK", "Get Sessions Histories Success", userSessions));
  });

  public updateMyProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const updatedProfile: UpdateUserProfileDto = req.body;

    const user: User = await this.account.updateUserProfile(user_id, updatedProfile);

    res.status(200).json(apiResponse(200, "OK", "Get Profile Success", user));
  });
}