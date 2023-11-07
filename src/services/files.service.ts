import { Service } from "typedi";
import { DB } from "@database";

import { File } from "@interfaces/file.interface";
import { HttpException } from "@/exceptions/HttpException";

@Service()
export class FileService {
  public async uploadSingleFile(user_id: number, file: Express.Multer.File): Promise<File> {
    const fileUpload = await DB.Files.create({
      user_id,
      name: file.filename,
      type: file.mimetype,
      size: file.size
    });

    delete fileUpload.dataValues.pk;
    delete fileUpload.dataValues.name;
    delete fileUpload.dataValues.user_id;

    return fileUpload;
  };
  
  public async getFileWithUUID(file_uuid: string): Promise<File> {
    const file = await DB.Files.findOne({
      attributes: ["name"],
      where: {
        uuid: file_uuid
      }
    });

    if(!file) throw new HttpException(false, 400, "File is not found");
    return file;
  };

  public async getUserFiles(user_id: number): Promise<File[]> {
    const files = await DB.Files.findAll({
      attributes: { exclude: ["pk", "user_id", "name"] },
      where: {
        user_id
      }
    });

    return files;
  };
};