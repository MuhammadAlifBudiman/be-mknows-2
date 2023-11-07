import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { UserModel } from "@models/users.model";
import { File } from "@interfaces/file.interface";

export type FileCreationAttributes = Optional<File, "pk" | "uuid">;

export class FileModel extends Model<File, FileCreationAttributes> implements File {
  public pk: number;
  public uuid: string;
  
  public name: string;
  public user_id: number;
  public type: string;
  public size: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof FileModel {
  FileModel.init(
    {
      pk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: UserModel,
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "files",
      timestamps: true,
      paranoid: true,
      sequelize
    },
  );

  return FileModel;
}