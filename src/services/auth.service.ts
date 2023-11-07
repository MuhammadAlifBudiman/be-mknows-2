import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Service } from "typedi";
import { Transaction } from "sequelize";

import { SECRET_KEY } from "@config/index";
import { DB } from "@database";

import { User } from "@interfaces/user.interface";
import { UserRole } from "@interfaces/authentication/user-role.interface";
import { UserSession } from "@interfaces/user-session.interface";
import { UserAgent } from "@interfaces/common/useragent.interface";
import { DataStoredInToken, TokenPayload } from "@interfaces/authentication/token.interface";

import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";

const createAccessToken = (user: User, userSession: UserSession): TokenPayload => {
  const dataStoredInToken: DataStoredInToken = { uid: user.uuid, sid: userSession.uuid };
  const expiresIn: number = 60 * 60 * 60;

  return { expiresIn: expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};  

const createCookie = (TokenPayload: TokenPayload): string => {
  return `Authorization=${TokenPayload.token}; HttpOnly; Max-Age=${TokenPayload.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: CreateUserDto): Promise<{ uuid: string, email: string }> {
    const transaction = await DB.sequelize.transaction();

    try {
      // await new Promise(resolve => setTimeout(resolve, 10000));

      const existingUser = await DB.Users.findOne({ where: { email: userData.email }, transaction });
      
      if (existingUser) {
        throw new HttpException(false, 409, `This email ${userData.email} already exists`);
      }
  
      const hashedPassword = await hash(userData.password, 10);
  
      const createUser = await DB.Users.create(
        { ...userData, password: hashedPassword },
        { transaction }
      );
  
      const roleId = await this.getRoleId("USER");
      await this.asignUserRole(createUser.pk, roleId, transaction);
  
      await transaction.commit();
  
      return { uuid: createUser.uuid, email: createUser.email };
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }

  public async login(userData: CreateUserDto, userAgent: UserAgent): Promise<{ cookie: string; accessToken: string }> {
    const findUser: User = await DB.Users.findOne({ attributes: ["pk", "uuid", "password"], where: { email: userData.email } });
    if (!findUser) throw new HttpException(false, 409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(false, 409, "Password not matching");

    const sessionData = await this.createUserSession({ 
      pk: findUser.pk, useragent: userAgent.source, ip_address: userAgent.ip_address
    });

    const TokenPayload = createAccessToken(findUser, sessionData);
    const { token } = TokenPayload;

    const cookie = createCookie(TokenPayload);
    return { cookie, accessToken: token };
  }

  public async logout(userData: User, userSessionId: string): Promise<boolean> {
    const findUser: User = await DB.Users.findOne({ where: { pk: userData.pk } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    const logout = await this.logoutSessionActive({ uid: findUser.uuid, sid: userSessionId });
    return logout;
  }

  public async checkSessionActive(session_id: string): Promise<UserSession> {
    const userSession = await DB.UsersSessions.findOne({ 
      where: { uuid: session_id, status: "ACTIVE" },
      include: [{ model: DB.Users, as: "user" }]
    });

    return userSession || null;
  };

  public async getUserRoles(user_id: number): Promise<UserRole[]> {
    const roles = await DB.UsersRoles.findAll({ 
      where: { user_id },
      include: [{ model: DB.Roles, as: "role" }]
    });

    return roles;
  };

  public async logoutSessionActive(data: { uid: string, sid: string }): Promise<boolean> {
    const userSession = await DB.UsersSessions.findOne({ 
      where: { uuid: data.sid, status: "ACTIVE" },
      include: { model: DB.Users, as: "user" }
    });
  
    if (userSession) {
      userSession.status = "LOGOUT";
      await userSession.save();
      return true;
    } else {
      return true;
    }
  }

  public async createUserSession(data: { pk: number, useragent: string, ip_address: string }): Promise<UserSession> {
    const session = await DB.UsersSessions.create({
      user_id: data.pk,
      useragent: data.useragent,
      ip_address: data.ip_address,
      status: "ACTIVE"
    });

    return session;
  };

  private async getRoleId(name: string): Promise<number> {
    const role = await DB.Roles.findOne({ where: { name }});
    return role.pk;
  }

  private async asignUserRole(user_id: number, role_id: number, transaction: Transaction): Promise<UserRole> {
    const role = await DB.UsersRoles.create({ user_id, role_id }, { transaction });
    return role;
  }
}