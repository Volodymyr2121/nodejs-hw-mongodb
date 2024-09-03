import { Router } from "express";
import { getAllContactsController, getContactsByIdContaroller } from "../controllers/contacts.js";
import { crtlWrapper } from "../utils/ctrlWrapper.js";

const contactsRouter = Router();

contactsRouter.get("/contacts", crtlWrapper(getAllContactsController));
    
contactsRouter.get("/contacts/:contactId", crtlWrapper(getContactsByIdContaroller));

export default contactsRouter;

