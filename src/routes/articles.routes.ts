import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import { ArticleController } from "@controllers/article.controller";
import { AuthMiddleware } from "@middlewares/auth.middleware";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto";

export class ArticleRoute implements Routes {
  public path = "articles";
  public router = Router();
  public article = new ArticleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/v1/${this.path}`, this.article.getArticles);
    this.router.get(`/v1/${this.path}/:article_id`, this.article.findOne);
    this.router.post(`/v1/${this.path}`, 
      AuthMiddleware, ValidationMiddleware(CreateArticleDto), 
      this.article.createArticle
    );
    this.router.put(
      `/v1/${this.path}/:article_id`, 
      AuthMiddleware, ValidationMiddleware(UpdateArticleDto), 
      this.article.updateArticle
    );
    this.router.delete(
      `/v1/${this.path}/:article_id`,
      AuthMiddleware,
      this.article.deleteArticle
    )
  }
}