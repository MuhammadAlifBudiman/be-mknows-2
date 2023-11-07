import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { User } from "@interfaces/user.interface";

import { FileModel } from "@models/files.model";

export type UserCreationAttributes = Optional<User, "pk" | "uuid" | "full_name" | "display_picture">;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public pk: number;
  public uuid: string;
  
  public full_name: string;
  public display_picture: number;
  public email: string;
  public password: string;
  // public is_email_verified: Date;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      pk: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      display_picture: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //   model: FileModel,
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: true,
      sequelize,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    },
  );

  FileModel.hasOne(UserModel, {
    foreignKey: "display_picture",
    as: "avatar"
  });

  UserModel.belongsTo(FileModel, {
    foreignKey: "display_picture",
    as: "avatar"
  });

  return UserModel;
}