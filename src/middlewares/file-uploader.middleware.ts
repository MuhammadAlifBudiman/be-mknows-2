import { Request } from "express";
import multer from "multer";

import { HttpException } from "@exceptions/HttpException";
import { MAX_SIZE_FILE_UPLOAD } from "@config/index";

export const uploadFile = multer({
  limits: {
    files: 10,
    fileSize: Number(MAX_SIZE_FILE_UPLOAD),
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  
  fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    if (!file.mimetype.match(/^image|application\/(jpg|jpeg|png)$/)) { // Regex
      return callback(new HttpException(false, 400, "Invalid File Format"));
    }
    callback(null, true);
  },
});