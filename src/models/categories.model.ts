import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { Category } from "@interfaces/category.interface";

export type CategoryCreationAttributes = Optional<Category, "pk" | "uuid">;

export class CategoryModel extends Model<Category, CategoryCreationAttributes> implements Category {
  public pk: number;
  public uuid: string;
  
  public name: string;
  public description: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof CategoryModel {
  CategoryModel.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "categories",
      timestamps: true,
      paranoid: true,
      sequelize
    },
  );

  return CategoryModel;
}