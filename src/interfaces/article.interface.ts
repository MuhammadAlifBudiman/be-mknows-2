export interface Article {
  pk: number;
  uuid: string;

  title: string;
  description: string;
  content: string;

  thumbnail_id: number;
  author_id: number;
}

export interface ArticleCategory {
  article_id: number;
  category_id: number;
}