import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { SECRET_KEY } from "@config/index";
import { HttpException } from "@exceptions/HttpException";

import { UserRole } from "@interfaces/authentication/user-role.interface";
import { UserSession } from "@interfaces/user-session.interface";
import { UserAgent } from "@interfaces/common/useragent.interface";
import { DataStoredInToken, RequestWithUser } from "@interfaces/authentication/token.interface";

import { AuthService } from "@services/auth.service";
import { getUserAgent } from "@utils/userAgent";

const getAuthorization = (req: Request) => {
  const coockie = req.cookies["Authorization"];
  if (coockie) return coockie;

  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];

  return null;
};

export const AuthorizedRoles = (roles: string[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userRoles = req.user_roles;
    const hasRequiredRole = roles.some(requiredRole => userRoles.includes(requiredRole));

    if (hasRequiredRole) {
      next();
    } else {
      next(new HttpException(false, 403, "Unauthorized Access #37"));
    }
  };
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const auth = new AuthService();
    const Authorization: string = getAuthorization(req);
    const userAgentPayload: UserAgent = getUserAgent(req);

    if (Authorization) {
      const { uid, sid } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const userSession: UserSession = await auth.checkSessionActive(sid);
      const userRoles: UserRole[] = await auth.getUserRoles(userSession.user.pk);

      if (userSession?.user?.uuid === uid) {
        if(userAgentPayload.source === userSession.useragent) {
          req.session_id = sid;
          req.user = userSession.user;
          req.user_roles = userRoles.map(userRole => userRole.role.name);

          next();
        } else {
          next(new HttpException(false, 401, "Invalid Token #60"));
        }
      } else {
        next(new HttpException(false, 401, "Invalid Token #63"));
      }
    } else {
      next(new HttpException(false, 401, "Invalid Token #66"));
    }
  } catch (error) {
    next(new HttpException(false, 401, "Invalid Token #70"));
  }
};