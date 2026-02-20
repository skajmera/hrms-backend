/**
 * Common interfaces used across the application
 */
export interface IApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    data?: T;
    error?: string;
    stack?: string;
}
export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface IPaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
export interface IQueryFilters {
    [key: string]: any;
}
export interface IDateRange {
    startDate: Date;
    endDate: Date;
}
export interface ISearchQuery {
    searchTerm?: string;
    filters?: IQueryFilters;
    pagination?: IPaginationOptions;
}
//# sourceMappingURL=common.interface.d.ts.map