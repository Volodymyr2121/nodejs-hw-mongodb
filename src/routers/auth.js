import { Router } from "express";
import { crtlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { userSignInSchema, userSignUpSchema } from "../validation/user.js";
import { authSignUpController, authSignInController} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/auth/register", validateBody(userSignUpSchema), crtlWrapper(authSignUpController));
authRouter.post("/auth/login", validateBody(userSignInSchema), crtlWrapper(authSignInController));

export default authRouter;