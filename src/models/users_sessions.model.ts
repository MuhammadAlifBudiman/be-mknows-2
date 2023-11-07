import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { UserSession } from "@interfaces/user-session.interface";

import { UserModel } from "@models/users.model";

export type UserSessionCreationAttributes = Optional<UserSession, "pk" | "uuid">;

export class UserSessionModel extends Model<UserSession, UserSessionCreationAttributes> implements UserSessionCreationAttributes {
  public pk: number;
  public uuid: string;
  
  public user_id: number;
  public useragent: string;
  public ip_address: string;
  public status: string; // ["EXPIRED", "ACTIVE", "LOGOUT"]

  public readonly user: UserModel;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof UserSessionModel {
  UserSessionModel.init(
    {
      pk: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        allowNull: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.STRING(52),
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER(),
      },
      useragent: {
        allowNull: false,
        type: DataTypes.STRING(320),
      },
      ip_address: {
        allowNull: false,
        type: DataTypes.STRING(64),
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
    },
    {
      tableName: "users_sessions",
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  UserSessionModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"
  });

  return UserSessionModel;
}