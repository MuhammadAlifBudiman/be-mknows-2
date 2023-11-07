import { Sequelize, DataTypes, Model } from "sequelize";

import { ArticleModel } from "@models/articles.model";
import { CategoryModel } from "@models/categories.model";

import { ArticleCategory } from "@interfaces/article.interface";

export type ArticleCategoryCreationAttributes = ArticleCategory;

export class ArticleCategoryModel extends Model<ArticleCategory, ArticleCategoryCreationAttributes> implements ArticleCategory {
  public article_id: number;
  public category_id: number;

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

  ArticleModel.hasMany(ArticleCategoryModel);
  ArticleCategoryModel.belongsTo(ArticleModel);

  CategoryModel.hasMany(ArticleCategoryModel);
  ArticleCategoryModel.belongsTo(CategoryModel);

  return ArticleCategoryModel;
}