import { Router } from "express";
import { createContactController, deleteContactController, getAllContactsController, getContactsByIdContaroller, patchContactController,  } from "../controllers/contacts.js";
import { crtlWrapper } from "../utils/ctrlWrapper.js";

const contactsRouter = Router();

contactsRouter.get("/contacts", crtlWrapper(getAllContactsController));
    
contactsRouter.get("/contacts/:contactId", crtlWrapper(getContactsByIdContaroller));

contactsRouter.post("/contacts", crtlWrapper(createContactController));

// contactsRouter.put("/contacts/:contactId", crtlWrapper(upsertContactController));

contactsRouter.patch("/contacts/:contactId", crtlWrapper(patchContactController));

contactsRouter.delete("/contacts/:contactId", crtlWrapper(deleteContactController));

export default contactsRouter;

