import { IsString, IsNotEmpty, MinLength, IsOptional } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public description: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @MinLength(4)
  @IsOptional()
  public description: string;
}