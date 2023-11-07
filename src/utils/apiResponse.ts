import { Pagination } from "@interfaces/common/pagination.interface";
import { ApiResponse } from "@interfaces/common/api-response.interface";

/**
 * Returns a custom response.
 */
export function apiResponse<T extends Pagination>(
  code: number,
  responseStatus: string,
  message: string,
  data?: unknown,
  meta?: T,
): ApiResponse {
  return {
    code,
    status: responseStatus,
    message,
    data: data || {},
    meta,
  };
}