import { getAllContacts, getContactsById } from "../services/contacts.js";
import createHttpError from "http-errors";



export const getAllContactsController = async (req, res, next) => {
    try {
         const contacts = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
    } catch (err) {
        next(err);
    }
   
};

export const getContactsByIdContaroller = async (req, res,) => {
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