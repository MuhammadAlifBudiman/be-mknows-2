import { ArticleCategoryModel } from "@/models/articles_categories.model";
import { File } from "./file.interface";

export interface Article {
  pk: number;
  uuid: string;

  title: string;
  description: string;
  content: string;

  thumbnail?: string | File;
  categories?: string[] | ArticleCategoryModel[];

  thumbnail_id: number;
  author_id: number;
}

export interface ArticleCategory {
  article_id: number;
  category_id: number;
}