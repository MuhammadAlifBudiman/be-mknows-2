import { Service } from "typedi";
import { DB } from "@database";

import { UserModel } from "@models/users.model";
import { FileModel } from "@models/files.model";

import { Article } from "@interfaces/article.interface";
import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto";
import { HttpException } from "@/exceptions/HttpException";


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
        }
      ]
    });

    const transformedArticles = articles.map(article => {
      return { 
        ...article.get(), 
        thumbnail: article.thumbnail.uuid, 
        thumbnail_id: undefined,
        author_id: undefined
      }
    });

    return transformedArticles;
  }

  public async createArticle(author_id: number, data: CreateArticleDto): Promise<Article> {
    const thumbnail = await DB.Files.findOne({ where: { uuid: data.thumbnail }});
    if(!thumbnail) throw new HttpException(false, 404, "File is not found");
    
    const article = await DB.Articles.create({ ...data, thumbnail_id: thumbnail.pk, author_id });
    return article;
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

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    const [_, [article]] = await DB.Articles.update(updatedData, {
      where: { uuid: article_id },
      returning: true,
    });
    
    delete article.dataValues.pk;
    delete article.dataValues.author_id;
    
    const file = await DB.Files.findOne({ where: { pk: article.thumbnail_id }});
    
    const response = {
      ...article.get(),
      thumbnail_id: undefined,
      thumbnail: file?.uuid,
    }

    return response;
  }

  public async deleteArticle(article_id: string, author_id: number): Promise<boolean> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id, author_id }});

    if(!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    // await article.destroy({ force: true });
    await article.destroy();
    return true;
  }
}