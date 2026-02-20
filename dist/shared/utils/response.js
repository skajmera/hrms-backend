"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaginatedResponse = exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
/**
 * Send success response
 */
const sendSuccessResponse = (res, message, data, statusCode = 200) => {
    const response = {
        status: 'success',
        message,
        ...(data !== undefined && { data })
    };
    res.status(statusCode).json(response);
};
exports.sendSuccessResponse = sendSuccessResponse;
/**
 * Send error response
 */
const sendErrorResponse = (res, message, statusCode = 500, error) => {
    const response = {
        status: 'error',
        message,
        ...(error && { error })
    };
    res.status(statusCode).json(response);
};
exports.sendErrorResponse = sendErrorResponse;
/**
 * Send paginated response
 */
const sendPaginatedResponse = (res, data, total, page, limit, message = 'Data retrieved successfully') => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const response = {
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
exports.sendPaginatedResponse = sendPaginatedResponse;
//# sourceMappingURL=response.js.map