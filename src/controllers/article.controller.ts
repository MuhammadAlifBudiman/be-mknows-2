import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { Article } from "@interfaces/article.interface";
import { RequestWithUser } from "@interfaces/authentication/token.interface";
import { ArticleService } from "@services/articles.service";

import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto";
import { apiResponse } from "@utils/apiResponse";

export class ArticleController {
  private article = Container.get(ArticleService);

  public getArticles = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const response: Article[] = await this.article.getArticles();
    res.status(200).json(apiResponse(200, "OK", "Get Articles Success", response));
  });

  public createArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const data: CreateArticleDto = req.body;

    const response: Article = await this.article.createArticle(user_id, data);
    res.status(201).json(apiResponse(201, "OK", "Create Article Success", response));
  });

  public updateArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params;
    const user_id = req.user.pk as number;
    const data: UpdateArticleDto = req.body;

    const response: Article = await this.article.updateArticle(article_id, user_id, data);
    res.status(200).json(apiResponse(200, "OK", "Update Article Success", response));
  });

  public deleteArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params;
    const user_id = req.user.pk as number;

    await this.article.deleteArticle(article_id, user_id);
    res.status(200).json(apiResponse(200, "OK", "Delete Article Success", {}));
  });
}