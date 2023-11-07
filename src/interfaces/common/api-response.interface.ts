import { Pagination } from "@interfaces/common/pagination.interface";

export interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data?: undefined | object | unknown;
  errors?: unknown[];
  meta?: Pagination;
}