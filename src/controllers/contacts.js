import { createContact, deleteContact, getAllContacts, getContactsById, updateContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";



export const getAllContactsController = async (req, res,) => {
    const { perPage, page } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const contacts = await getAllContacts({ perPage, page, sortBy, sortOrder });
    
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

export const createContactController = async (req, res) => {
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

// export const upsertContactController = async (req, res, next) => {
//     const { contactId } = req.params;
//     const result = await updateContact(contactId, req.body, { upsert: true });
    
//     if (!result) {
//         next(createHttpError(404, 'Contact not found'));
//         return;
// }

//     const status = result.isNew ? 201 : 200;

//     res.status(status).json({
//         status,
//         message: "Successfully upsert a contact!",
//         data: result.contact,
//     });

// };

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body,);
    
    if (!result) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    
      res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    res.status(204).send();
};