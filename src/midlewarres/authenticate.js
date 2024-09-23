import createHttpError from "http-errors";
import { findAccesTokenBySession, findUser } from "../services/auth.js";

export const authenticate = async (req, res, next) => {
    const autorization = req.get("Authorization");
    if (!autorization) {
        return next(createHttpError(401, "Autorization header not found"));
    }

    const [bearer, token] = autorization.split(" ");

    if (bearer !== "Bearer") {
        return next(createHttpError(401, "Autorization header must have Bearer type"));
    }

    const session = await findAccesTokenBySession(token);
    if (!session) {
         return next(createHttpError(401, "Session not found"));
    }
    if (new Date() > session.accesTokenValidUnit) {
        return next(createHttpError(401, "Acces token expired"));
    }

    const user = await findUser({ _id: session.userId });
    if (!user) {
        return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    next();
};