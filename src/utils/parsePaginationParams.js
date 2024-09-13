const parseInteger = (value, defaultValue) => {
    if (typeof (value) !== "string") return defaultValue;

    const parseValue = parseInt(value);
    if (Number.isNaN(parseValue)) return defaultValue;

    return parseValue;
};

const parsePaginationParams = ({  perPage, page }) => {
    const parsePage = parseInteger(page, 1);
    const parsePerPage = parseInteger(perPage, 10);

    return ({
        perPage: parsePerPage,
        page: parsePage,
    });
};

export default parsePaginationParams;