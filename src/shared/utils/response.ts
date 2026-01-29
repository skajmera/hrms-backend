import { Response } from 'express';
import { IApiResponse, IPaginatedResponse } from '../interfaces/common.interface';

/**
 * Send success response
 */
export const sendSuccessResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): void => {
  const response: IApiResponse<T> = {
    status: 'success',
    message,
    ...(data !== undefined && { data })
  };

  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any
): void => {
  const response: IApiResponse = {
    status: 'error',
    message,
    ...(error && { error })
  };

  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Data retrieved successfully'
): void => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const response: IApiResponse<IPaginatedResponse<T>> = {
    status: 'success',
    message,
    data: {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    }
  };

  res.status(200).json(response);
};
