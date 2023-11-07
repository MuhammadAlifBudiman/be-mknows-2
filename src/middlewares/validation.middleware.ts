import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { HttpException } from "@exceptions/HttpException";

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (type: any, skipMissingProperties = false, whitelist = true, forbidNonWhitelisted = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const messages = errors.map((error: ValidationError) => {
          if(Object.values(error.constraints)[0].endsWith("be empty")) {
            return Object.values(error.constraints)[0]
              .split("_")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }

          if(Object.values(error.constraints)[0].endsWith("should not exist")) {
            return "Invalid Property"
          }

          if(Object.values(error.constraints)[0].endsWith("be a UUID")) {
            return Object.values(error.constraints)[0]
              .split("_")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }

          if(Object.values(error.constraints)[0].includes("characters")) {
            return Object.values(error.constraints)[0]
              .split("_")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          
          return Object.values(error.constraints)[0];
        });
        
        next(new HttpException(false, 400, "Fields is required", messages));
      });
  };
};