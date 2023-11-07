import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { CategoryController } from "@controllers/category.controller";
import { AuthMiddleware, AuthorizedRoles } from "@middlewares/auth.middleware";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { CreateCategoryDto, UpdateCategoryDto } from "@/dtos/categories.dto";

export class CategoryRoute implements Routes {
  public path = "categories";
  public router = Router();
  public category = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/v1/${this.path}`, this.category.getCategories);
    this.router.post(`/v1/${this.path}`, 
      AuthMiddleware, AuthorizedRoles(["ADMIN"]), ValidationMiddleware(CreateCategoryDto), 
      this.category.createCategory
    );
    this.router.put(
      `/v1/${this.path}/:category_id`, 
      AuthMiddleware, AuthorizedRoles(["ADMIN"]), ValidationMiddleware(UpdateCategoryDto), 
      this.category.updateCategory
    );
    this.router.delete(
      `/v1/${this.path}/:category_id`,
      AuthMiddleware, AuthorizedRoles(["ADMIN"]),
      this.category.deleteCategory
    )
  }
}