import createHttpError from "http-errors";
import { UserCollections } from "../db/models/user.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { accessTokenLifetime, refreshTokenLifetime } from "../constant/user.js";
import { SessionCollection } from "../db/models/session.js";



export const signUp = async (payload) => {
    const { email,password } = payload;
    const userEmail = await UserCollections.findOne({email});
    if (userEmail) {
        throw createHttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await UserCollections.create({...payload, password: hashPassword});
    delete user._doc.password;

    return user._doc;
};

export const signIn = async (payload) => {
    const { email, password } = payload;

    const user = await UserCollections.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Email invalid");
    }

    const userPassword = await bcrypt.compare(password, user.password);
    if (!userPassword) {
        throw createHttpError(401, "Password invalid");
    }

    await SessionCollection.deleteOne({ userId: user._id });

    const accesToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");
    const accesTokenValidUnit = new Date(Date.now() + accessTokenLifetime);
    const refreshTokenValidUnit = new Date(Date.now() + refreshTokenLifetime);

    const userSession = await SessionCollection.create({
        userId: user._id,
        accesToken,
        refreshToken,
        accesTokenValidUnit,
        refreshTokenValidUnit,
    });

    return userSession;
};