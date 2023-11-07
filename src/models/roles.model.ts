import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Role } from "@interfaces/authentication/user-role.interface";

export type RoleCreationAttributes = Optional<Role, "pk" | "uuid">;

export class RoleModel extends Model<Role, RoleCreationAttributes> implements Role {
  public pk: number;
  public uuid: string;
  
  public name: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof RoleModel {
  RoleModel.init(
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
        unique: true
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING(52),
        unique: true
      },
    },
    {
      tableName: "roles",
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  return RoleModel;
}