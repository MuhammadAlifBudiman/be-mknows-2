import { Service } from "typedi";
import { DB } from "@database";
import { CreateCategoryDto, UpdateCategoryDto } from "@dtos/categories.dto"
import { HttpException } from "@/exceptions/HttpException";
import { Category } from "@/interfaces/category.interface";

@Service()
export class CategoryService {
  public async getCategories(): Promise<Category[]> {
    const allCategories: Category[] = await DB.Categories.findAll();
    return allCategories;
  }

  public async createCategory(data: CreateCategoryDto): Promise<Category> {
    const name: string = data.name.toLowerCase();
    const findCategory: Category = await DB.Categories.findOne({ where: { name } });
    if (findCategory) throw new HttpException(false, 409, `This category ${name} already exists`);

    const createCategory: Category = await DB.Categories.create({...data, name});

    return createCategory;
  }

  public async updateCategory(category_id: string, data: UpdateCategoryDto): Promise<Category> {
    const findCategory: Category = await DB.Categories.findOne({ where: { uuid: category_id } });
    const name: string = data.name.toLowerCase();
    const findName: Category = await DB.Categories.findOne({ where: { name } });
    if (findName) throw new HttpException(false, 409, `This category ${name} already exists`);

    if (!findCategory) throw new HttpException(false, 409, "Category doesn't exist");
    
    const updatedData: any = {};
    if (data.name) updatedData.name = data.name.toLowerCase();
    if (data.description) updatedData.description = data.description;

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    const [_, [category]] = await DB.Categories.update(updatedData, {
      where: { uuid: category_id },
      returning: true,
    });

    const updateCategory: Category= await DB.Categories.findOne({ where: { uuid: category_id } });
    return updateCategory;
  }

  public async deleteCategory(category_id: string): Promise<Category> {
    const findCategory: Category = await DB.Categories.findOne({ where: { uuid: category_id } });

    if (!findCategory) throw new HttpException(false, 409, "Category doesn't exist");

    await DB.Categories.destroy({ where: { uuid: category_id } });

    return findCategory;
  }
}
