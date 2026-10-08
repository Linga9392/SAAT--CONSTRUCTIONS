// Create pagination values from request query
export const getPagination = (
    page = 1,
    limit = 10
) => {
    const currentPage = Math.max(
        Number(page) || 1,
        1
    );

    const perPage = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const offset = (
        currentPage - 1
    ) * perPage;

    return {
        page: currentPage,
        limit: perPage,
        offset
    };
};

// Create pagination response
export const createPaginationResponse = (
    data,
    page,
    limit,
    total
) => {
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(
                total / limit
            )
        }
    };
};