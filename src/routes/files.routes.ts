import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import { FileController } from "@controllers/file.controller";

import { AuthMiddleware } from "@middlewares/auth.middleware";
import { uploadFile } from "@middlewares/file-uploader.middleware";

export class FileRoute implements Routes {
  public path = "files";
  public router = Router();
  public file = new FileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/v1/${this.path}/upload`, 
      AuthMiddleware,
      uploadFile.single("file"), 
      this.file.uploadFile
    );
    this.router.get(
      `/v1/${this.path}/:file_id/preview`, 
      AuthMiddleware, 
      this.file.getFileWithUUID
    );
    this.router.get(
      `/v1/${this.path}/mine`, 
      AuthMiddleware, 
      this.file.getFileMine
    );
  }
}