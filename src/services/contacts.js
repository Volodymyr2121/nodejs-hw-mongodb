import { ContactCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContactCollection.find();
    return contacts;
};

export const getContactsById = async (contactId) => {
    const contact = await ContactCollection.findById(contactId);
    return contact;
};