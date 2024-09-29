import { createContact, deleteContact, getAllContacts, getContactsById, updateContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import { parseContactsFilterParams } from "../utils/filter/parseContactsFilterParamams.js";
import saveFileToUploadsDir from "../utils/saveFileToUploadsDir.js";
import saveFileToCloudinary from "../utils/saveFileToCloudinary.js";
import { env } from "../utils/env.js";


const enableCloudinary = env("ENABLE_CLOUDINARY");

export const getAllContactsController = async (req, res,) => {
    const { perPage, page } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const { _id: userId } = req.user;
    const  filter  = parseContactsFilterParams(req.query);
    const contacts = await getAllContacts({ perPage, page, sortBy, sortOrder, filter: {...filter, userId} });
    
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactsByIdContaroller = async (req, res, next) => {
    const { contactId } = req.params;
     const { _id: userId } = req.user;
    const contact = await getContactsById({_id: contactId, userId});

        

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
    let photo;
    if (req.file) {
        if (enableCloudinary === "true") {
            photo = await saveFileToCloudinary(req.file, "photo");
        } else {
            photo = await saveFileToUploadsDir(req.file);
    }
        }
        
    const { _id: userId } = req.user;
    const contact = await createContact({...req.body, userId, photo});

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

export const upsertContactController = async (req, res, next) => {
    const { contactId } = req.params;
     const { _id: userId } = req.user;
    const result = await updateContact({id:contactId, userId}, req.body, { upsert: true });
    
    if (!result) {
        next(createHttpError(404, 'Contact not found'));
        return;
}

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: "Successfully upsert a contact!",
        data: result.contact,
    });

};

export const patchContactController = async (req, res, next) => {
let photo;
    if (req.file) {
        if (enableCloudinary === "true") {
            photo = await saveFileToCloudinary(req.file, "photo");
        } else {
            photo = await saveFileToUploadsDir(req.file);
    }
        }

    const { contactId } = req.params;
     const { _id: userId } = req.user;  
    const result = await updateContact({_id: contactId, userId}, req.body, photo);
    
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
     const { _id: userId } = req.user;
    const contact = await deleteContact({_id: contactId, userId});

    if (!contact) {
        next(createHttpError(404, `Movie with id=${contactId} not found`));
        return;
    }

    res.status(204).send();
};