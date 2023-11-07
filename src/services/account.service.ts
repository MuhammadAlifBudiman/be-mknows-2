import { Service } from "typedi";
import { DB } from "@database";

import { User } from "@interfaces/user.interface";
import { UserSession } from "@interfaces/user-session.interface";

import { UserModel } from "@models/users.model";
import { UserSessionModel } from "@models/users_sessions.model";
import { UpdateUserProfileDto } from "@dtos/account.dto";
import { HttpException } from "@/exceptions/HttpException";

@Service()
export class AccountService {
  public async getProfileByUserId(user_id: number): Promise<User> {
    const user: UserModel = await DB.Users.findOne({ 
      attributes: { exclude: ["pk"] },
      where: { pk: user_id }
    });

    const file = await DB.Files.findOne({ where: { pk: user.display_picture }});

    const response = {
      ...user.get(),
      display_picture: file?.uuid,
    };

    return response;
  }

  public async getSessionsHistoriesByUserId(user_id: number, session_id: string): Promise<UserSession[]> {
    const userSessions: UserSessionModel[] = await DB.UsersSessions.findAll({
      attributes: { exclude: ["pk", "user_id"] },
      where: { user_id }
    });

    const userSessionsParsed = userSessions.map(session => ({
      ...session.get(),
      is_current: session.uuid === session_id
    }));

    userSessionsParsed.sort((a, b) => (b.is_current ? 1 : 0) - (a.is_current ? 1 : 0));
    return userSessionsParsed;
  }

  public async updateUserProfile(user_id: number, data: UpdateUserProfileDto): Promise<User> {
    const updatedData: any = {};
  
    if (data.full_name) updatedData.full_name = data.full_name;
  
    if (data.display_picture) {
      const file = await DB.Files.findOne({ attributes: ["pk"], where: { uuid: data.display_picture, user_id } });
  
      if (!file) {
        throw new HttpException(false, 400, "File is not found");
      }
  
      updatedData.display_picture = file.pk;
    }
  
    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }
  
    const [_, [user]] = await DB.Users.update(updatedData, {
      where: { pk: user_id },
      returning: true,
    });

    delete user.dataValues.pk;
    delete user.dataValues.password;

    const file = await DB.Files.findOne({ where: { pk: user.display_picture }});
    
    const response = {
      ...user.get(),
      display_picture: file?.uuid,
    }

    return response;
  }
}