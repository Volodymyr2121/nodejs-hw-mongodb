import { Router } from "express";
import { createContactController, deleteContactController, getAllContactsController, getContactsByIdContaroller, patchContactController, upsertContactController } from "../controllers/contacts.js";
import { crtlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { contactsAddSchema, contactsPatchSchema } from "../validation/contacts.js";
import isValidId from "../midlewarres/isValidId.js";
import { authenticate } from "../midlewarres/authenticate.js";
import upload from "../midlewarres/upload.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", crtlWrapper(getAllContactsController));
    
contactsRouter.get("/:contactId",isValidId, crtlWrapper(getContactsByIdContaroller));

contactsRouter.post("/", upload.single("photo"), validateBody(contactsAddSchema), crtlWrapper(createContactController));

contactsRouter.put("/contacts/:contactId",validateBody(contactsAddSchema), crtlWrapper(upsertContactController));

contactsRouter.patch("/:contactId", upload.single("photo"), isValidId, validateBody(contactsPatchSchema), crtlWrapper(patchContactController));

contactsRouter.delete("/:contactId",isValidId, crtlWrapper(deleteContactController));

export default contactsRouter;

