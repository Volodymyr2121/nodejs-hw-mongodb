import { SORT_ORDER } from "../constant/index.js";

const parseSortParams = ({sortBy, sortOrder}) => {
    const parseSortBy = sortBy === "name" ? sortBy : "_id";
    const parseSortOrder = SORT_ORDER.includes(sortOrder) ? sortOrder : SORT_ORDER[0];

    return {
        sortBy: parseSortBy,
        sortOrder: parseSortOrder,
    };
};

export default parseSortParams;