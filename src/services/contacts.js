import { SORT_ORDER } from "../constant/index.js";
import { ContactCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({ perPage, page, sortBy = "_id", sortOrder = SORT_ORDER[0] }) => {
    const skip = (page - 1) * perPage;
    const contacts = await ContactCollection.find().skip(skip).limit(perPage).sort({[sortBy]: sortOrder});
    const count = await ContactCollection.find().countDocuments();

    const paginationContacts = calculatePaginationData({ count, perPage, page });

    return {
        contacts,
        page: page,
        perPage: perPage,
        totalItem: count,
        ...paginationContacts,
    };
};

export const getContactsById = async (contactId) => {
    const contact = await ContactCollection.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactCollection.create(payload);
    return contact;
};

export const updateContact = async (studentId, payload, options = {}) => {
    const rawResult = await ContactCollection.findOneAndUpdate({_id: studentId}, payload, {
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

export const deleteContact = async (contactId) => {
    const contact = ContactCollection.findByIdAndDelete({ _id: contactId });
    return contact;
};