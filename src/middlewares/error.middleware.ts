import { NextFunction, Request, Response } from "express";
import { HttpException } from "@exceptions/HttpException";
import { logger } from "@utils/logger";

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";
    const errors: string[] = error.errors || [];
    // const success: boolean = error.success || false;

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ code: status, status: "BAD REQUEST", message, errors });
  } catch (error) {
    next(error);
  }
};