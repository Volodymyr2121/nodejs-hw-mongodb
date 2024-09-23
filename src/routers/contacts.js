import { Router } from "express";
import { createContactController, deleteContactController, getAllContactsController, getContactsByIdContaroller, patchContactController, upsertContactController } from "../controllers/contacts.js";
import { crtlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { contactsAddSchema, contactsPatchSchema } from "../validation/contacts.js";
import isValidId from "../midlewarres/isValidId.js";
import { authenticate } from "../midlewarres/authenticate.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", crtlWrapper(getAllContactsController));
    
contactsRouter.get("/:contactId",isValidId, crtlWrapper(getContactsByIdContaroller));

contactsRouter.post("/", validateBody(contactsAddSchema), crtlWrapper(createContactController));

contactsRouter.put("/contacts/:contactId",validateBody(contactsAddSchema), crtlWrapper(upsertContactController));

contactsRouter.patch("/:contactId",isValidId, validateBody(contactsPatchSchema), crtlWrapper(patchContactController));

contactsRouter.delete("/:contactId",isValidId, crtlWrapper(deleteContactController));

export default contactsRouter;

