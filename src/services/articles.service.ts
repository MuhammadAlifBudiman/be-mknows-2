import { Service } from "typedi";
import { DB } from "@database";

import { UserModel } from "@models/users.model";
import { FileModel } from "@models/files.model";

import { Article } from "@interfaces/article.interface";
import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto";
import { HttpException } from "@/exceptions/HttpException";
import { Op } from 'sequelize';
import { ArticleCategoryModel } from '@/models/articles_categories.model';
import { CategoryModel } from '@/models/categories.model';


@Service()
export class ArticleService {
  public async getArticles(): Promise<Article[]> {
    const articles = await DB.Articles.findAll({ 
      attributes: { 
        exclude: ["pk"],
      },
      include: [
        {
          attributes: ["uuid"],
          model: FileModel,
          as: "thumbnail",
        },
        {
          attributes: ["uuid", "full_name", "display_picture"],
          model: UserModel,
          as: "author",
          include: [
            {
              attributes: ["uuid"],
              model: FileModel,
              as: "avatar"
            }
          ]
        },
        {
          attributes: ["category_id"],
          model: ArticleCategoryModel,
          as: "categories",
          include: [{
            attributes: ["uuid", "name"],
            model: CategoryModel, 
            as: "category"
          }]
        }
      ]
    });

    const transformedArticles = articles.map(article => {
      return { 
        ...article.get(), 
        thumbnail: article.thumbnail.uuid, 
        thumbnail_id: undefined,
        author_id: undefined,
        categories: article.categories.map(category => category.category.name),
      }
    });

    return transformedArticles;
  }

  public async findArticle(article_id: string): Promise<Article> {
    const article = await DB.Articles.findOne({
      where: { uuid: article_id },
      include: [
        {
          attributes: ["uuid"],
          model: FileModel,
          as: "thumbnail",
        },
        {
          attributes: ["uuid", "full_name", "display_picture"],
          model: UserModel,
          as: "author",
          include: [
            {
              attributes: ["uuid"],
              model: FileModel,
              as: "avatar"
            }
          ]
        },
        {
          attributes: ["category_id"],
          model: ArticleCategoryModel,
          as: "categories",
          include: [{
            attributes: ["uuid", "name"],
            model: CategoryModel, 
            as: "category"
          }]
        }
      ]
    })

    if(!article) {
      throw new HttpException(false, 404, "Article is not found");
    }

    return {
      ...article.get(), 
      thumbnail: article.thumbnail.uuid, 
      thumbnail_id: undefined,
      author_id: undefined,
      categories: article.categories.map(category => category.category.name),
    };
  }

  public async createArticle(author_id: number, data: CreateArticleDto): Promise<Article> {
    const thumbnail = await DB.Files.findOne({ where: { uuid: data.thumbnail }});
    if(!thumbnail) throw new HttpException(false, 404, "File is not found");

    const categories = await DB.Categories.findAll({
      attributes: ['pk'],
      where: {
        name: { [Op.in]: data.categories }
      }
    })
    if (categories.length <= 0) {
      throw new HttpException(false, 404, "Categories is not found");
    }

    const transaction = await DB.sequelize.transaction();
    try {
      const article = await DB.Articles.create({
        title: data.title,
        description: data.description,
        content: data.content,
        thumbnail_id: thumbnail.pk,
        author_id
      }, { transaction});
      for (const category of categories) {
        await DB.ArticleCategory.create({
          article_id: article.pk,
          category_id: category.pk
        }, { transaction });
      }
      await transaction.commit();

      return this.findArticle(article.uuid);
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }
  
  public async updateArticle(article_id: string, author_id: number, data: UpdateArticleDto): Promise<Article> {
    const updatedData: any = {};
    
    if (data.title) updatedData.title = data.title;
    if (data.description) updatedData.description = data.description;
    if (data.content) updatedData.content = data.content;
    
    if (data.thumbnail) {
      const file = await DB.Files.findOne({ 
        attributes: ["pk"], 
        where: { 
          uuid: data.thumbnail, 
          user_id: author_id 
        } 
      });
      
      if (!file) {
        throw new HttpException(false, 400, "File is not found");
      }
  
      updatedData.thumbnail = file.pk;
    }

    if (data.categories) {
      const categories = await DB.Categories.findAll({
        attributes: ['pk'],
        where: {
          name: { [Op.in]: data.categories }
        }
      })
      if (categories.length <= 0) {
        throw new HttpException(false, 404, "Categories is not found");
      }
    }

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    const article = await DB.Articles.findOne({ where: { uuid: article_id, author_id }});
    if (!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    const transaction = await DB.sequelize.transaction();
    try {
      if (Object.keys(updatedData).length > 0) {
        await DB.Articles.update(updatedData, {
          where: { uuid: article_id },
          returning: true,
          transaction,
        });
      }

      if (data.categories) {
        const categories = await DB.Categories.findAll({
          attributes: ['pk'],
          where: {
            name: { [Op.in]: data.categories }
          }
        })
        if (categories.length >= 0) {
          DB.ArticleCategory.destroy({
            where: { article_id: article.pk },
            force: true,
            transaction
          })
          for (const category of categories) {
            await DB.ArticleCategory.create({
              article_id: article.pk,
              category_id: category.pk
            }, { transaction });
          }
        }
      }

      await transaction.commit();

      return this.findArticle(article.uuid);

    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }

  public async deleteArticle(article_id: string, author_id: number): Promise<boolean> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id, author_id }});

    if(!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    const transaction = await DB.sequelize.transaction();
    try {
      await article.destroy({ transaction });
      await DB.ArticleCategory.destroy({ 
        where: { article_id: article.pk }, 
        transaction 
      })
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }
}