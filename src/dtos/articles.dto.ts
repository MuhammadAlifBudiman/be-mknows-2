import { IsString, IsNotEmpty, MinLength, IsOptional, IsArray } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public content: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(36)
  public thumbnail: string | number;

  @IsArray()
  @IsNotEmpty()
  public categories: string[];
}

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  public title: string;

  @IsString()
  @MinLength(4)
  @IsOptional()
  public description: string;

  @IsString()
  @MinLength(4)
  @IsOptional()
  public content: string;

  @IsString()
  @MinLength(36)
  @IsOptional()
  public thumbnail: string | number;

  @IsArray()
  @IsOptional()
  public categories: string[];
}