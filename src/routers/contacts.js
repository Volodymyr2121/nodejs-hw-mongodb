import { Router } from "express";
import { createContactController, deleteContactController, getAllContactsController, getContactsByIdContaroller, patchContactController,  } from "../controllers/contacts.js";
import { crtlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { contactsAddSchema, contactsPatchSchema } from "../validation/contacts.js";
import  isValidId  from "../midlewarres/isValidId.js";

const contactsRouter = Router();

contactsRouter.get("/contacts", crtlWrapper(getAllContactsController));
    
contactsRouter.get("/contacts/:contactId",isValidId, crtlWrapper(getContactsByIdContaroller));

contactsRouter.post("/contacts", validateBody(contactsAddSchema), crtlWrapper(createContactController));

// contactsRouter.put("/contacts/:contactId",validateBody(contactsAddSchema), crtlWrapper(upsertContactController));

contactsRouter.patch("/contacts/:contactId",isValidId, validateBody(contactsPatchSchema), crtlWrapper(patchContactController));

contactsRouter.delete("/contacts/:contactId",isValidId, crtlWrapper(deleteContactController));

export default contactsRouter;

