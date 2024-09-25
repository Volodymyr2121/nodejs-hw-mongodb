import { SORT_ORDER } from "../constant/index.js";
import { ContactCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({ perPage, page, sortBy = "_id", sortOrder = SORT_ORDER[0], filter = {} }) => {
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactCollection.find();
    if (filter.type) {
        contactsQuery.where("contactType").equals(filter.type);
    }
    if (filter.isFavourite)
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    if (filter.userId)
        contactsQuery.where("userId").equals(filter.userId);

    const contacts = await contactsQuery.skip(skip).limit(perPage).sort({[sortBy]: sortOrder});
    const count = await ContactCollection.find().merge(contactsQuery).countDocuments();

    const paginationContacts = calculatePaginationData({ count, perPage, page });

    return {
        contacts,
        page: page,
        perPage: perPage,
        totalItem: count,
        ...paginationContacts,
    };
};

export const getContactsById = async ({_id: contactId, userId}) => {
    const contact = await ContactCollection.findOne({_id: contactId, userId});
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactCollection.create(payload);
    return contact;
};

export const updateContact = async ({contactId, userId}, payload, options = {}) => {
    const rawResult = await ContactCollection.findOneAndUpdate({_id: contactId, userId}, payload, {
        new: true,
        includeResultMetadata: true,
        ...options,
    },);

    if (!rawResult || !rawResult.value) return null;
    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject?.upserted),
    };
};

export const deleteContact = async ({contactId, userId}) => {
    const contact = ContactCollection.findOneAndDelete({ _id: contactId, userId });
    return contact;
};