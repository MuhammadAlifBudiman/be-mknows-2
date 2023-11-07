import { Response, NextFunction, Request } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { RequestWithUser } from "@interfaces/authentication/token.interface";

import { apiResponse } from "@utils/apiResponse";
import { CategoryService } from "@/services/categories.service";
import { Category } from "@/interfaces/category.interface";
import { CreateCategoryDto, UpdateCategoryDto } from "@/dtos/categories.dto";

export class CategoryController {
  private category = Container.get(CategoryService);

  public getCategories = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const response: Category[] = await this.category.getCategories();
    res.status(200).json(apiResponse(200, "OK", "Get Categories Success", response));
  });

  public createCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CreateCategoryDto = req.body;

    const response: Category = await this.category.createCategory(data);
    res.status(201).json(apiResponse(201, "OK", "Create Category Success", response));
  });

  public updateCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { category_id } = req.params;
    const data: UpdateCategoryDto = req.body;

    const response: Category = await this.category.updateCategory(category_id, data);
    res.status(200).json(apiResponse(200, "OK", "Update Category Success", response));
  });

  public deleteCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { category_id } = req.params;

    await this.category.deleteCategory(category_id);
    res.status(200).json(apiResponse(200, "OK", "Delete Category Success", {}));
  });
}