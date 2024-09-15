import { contactTypeList } from "../../constant/contacts.js";

const parseType = (type) => {
     const isString = typeof type === 'string';
    if (!isString) return;
    const isType = (type) => contactTypeList.includes(type);

  if (isType(type)) return type;
};

const parseIsFavourite = (isFavourite) => { 
    if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
  return undefined;
};

export const parseContactsFilterParams = (filter) => {
    const { type, isFavourite } = filter;
    const parsedType = parseType(type);
  const  parsedIsFavourite = parseIsFavourite(isFavourite);

    return ({
        type: parsedType,
        isFavourite: parsedIsFavourite
    });
};