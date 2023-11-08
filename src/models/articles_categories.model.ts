import { Sequelize, DataTypes, Model } from "sequelize";

import { ArticleModel } from "@models/articles.model";
import { CategoryModel } from "@models/categories.model";

import { ArticleCategory } from "@interfaces/article.interface";
import { Category } from "@/interfaces/category.interface";

export type ArticleCategoryCreationAttributes = ArticleCategory;

export class ArticleCategoryModel extends Model<ArticleCategory, ArticleCategoryCreationAttributes> implements ArticleCategory {
  public article_id: number;
  public category_id: number;

  public readonly category: Category;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof ArticleCategoryModel {
  ArticleCategoryModel.init(
    {
      article_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      category_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "articles_categories",
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  ArticleModel.belongsToMany(CategoryModel, { through: ArticleCategoryModel, foreignKey: "article_id" });
  CategoryModel.belongsToMany(ArticleModel, { through: ArticleCategoryModel, foreignKey: "category_id" });

  ArticleModel.hasMany(ArticleCategoryModel, { foreignKey: "article_id", as: "categories" });
  ArticleCategoryModel.belongsTo(ArticleModel, { foreignKey: "article_id", as: "article" });

  CategoryModel.hasMany(ArticleCategoryModel, { foreignKey: "category_id", as: "category" });
  ArticleCategoryModel.belongsTo(CategoryModel, { foreignKey: "category_id", as: "category" });

  return ArticleCategoryModel;
}