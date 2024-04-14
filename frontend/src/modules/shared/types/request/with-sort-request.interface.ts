export interface WithSortRequest<T extends Record<string, any>> {
    sortBy: keyof T | string;
    sortDirection: 'asc' | 'desc';
}
