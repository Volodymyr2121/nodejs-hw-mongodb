import { ContactCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContactCollection.find();
    return contacts;
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