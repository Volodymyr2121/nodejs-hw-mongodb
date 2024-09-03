import { getAllContacts, getContactsById } from "../services/contacts.js";
import createHttpError from "http-errors";



export const getAllContactsController = async (req, res,) => {
    const contacts = await getAllContacts();
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactsByIdContaroller = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactsById(contactId);

        

    if (!contact) {
        throw createHttpError(404, "Contacts not found");
    }

    res.json({
        status: 200,
        message: "Successfully found contact!",
        data: contact,
    });
};