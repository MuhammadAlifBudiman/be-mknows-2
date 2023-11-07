import { Sequelize } from "sequelize";
import { NODE_ENV } from "@config/index";
import { logger } from "@utils/logger";

import config from "@config/database";
const dbConfig = config[NODE_ENV] || config["development"];

import RoleModel from "@models/roles.model";
import FileModel from "@models/files.model";
import UserModel from "@models/users.model";
import UserRoleModel from "@models/users_roles.model";
import UserSessionModel from "@models/users_sessions.model";

import ArticleModel from "@models/articles.model";
import CategoryModel from "@/models/categories.model";

const sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password,
  dbConfig
);

sequelize
  .authenticate()
  .then(() => logger.info(`=> Database Connected on ${NODE_ENV}`))
  .catch((e) => console.error(e));

export const DB = {
  Files: FileModel(sequelize),
  Roles: RoleModel(sequelize),
  Users: UserModel(sequelize),
  UsersRoles: UserRoleModel(sequelize),
  UsersSessions: UserSessionModel(sequelize),

  Articles: ArticleModel(sequelize),

  Categories: CategoryModel(sequelize),

  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};