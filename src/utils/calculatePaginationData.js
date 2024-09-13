export const calculatePaginationData = ({count, perPage, page}) => {
    const totalPage = Math.ceil(count / perPage);
    const hasPreviousPage = page !== 1;
    const hasNextPage = page < totalPage;

    return {
        totalPage,
        hasPreviousPage,
        hasNextPage,
    };
};