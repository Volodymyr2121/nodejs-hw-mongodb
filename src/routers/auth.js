import { Router } from "express";
import { crtlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { userSignInSchema, userSignUpSchema } from "../validation/user.js";
import { authSignUpController, authSignInController, refreshController, logoutContoller} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/register", validateBody(userSignUpSchema), crtlWrapper(authSignUpController));
authRouter.post("/login", validateBody(userSignInSchema), crtlWrapper(authSignInController));
authRouter.post("/refresh", crtlWrapper(refreshController));
authRouter.post("/logout", crtlWrapper(logoutContoller));

export default authRouter;