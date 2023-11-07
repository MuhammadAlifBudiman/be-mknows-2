import { Sequelize, DataTypes, Model } from "sequelize";
import { UserRole } from "@interfaces/authentication/user-role.interface";

import { RoleModel } from "@models/roles.model";
import { UserModel } from "@models/users.model";

export type UserRoleCreationAttributes = UserRole;

export class UserRoleModel extends Model<UserRole, UserRoleCreationAttributes> implements UserRole {
  public user_id: number;
  public role_id: number;

  public role?: RoleModel;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof UserRoleModel {
  UserRoleModel.init(
    {
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      role_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "users_roles",
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  UserModel.belongsToMany(RoleModel, { through: UserRoleModel, foreignKey: "user_id" });
  RoleModel.belongsToMany(UserModel, { through: UserRoleModel, foreignKey: "role_id" });

  UserModel.hasMany(UserRoleModel);
  UserRoleModel.belongsTo(UserModel);

  RoleModel.hasMany(UserRoleModel);
  UserRoleModel.belongsTo(RoleModel, { foreignKey: "role_id", as: "role" });

  return UserRoleModel;
}