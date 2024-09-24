import createHttpError from "http-errors";
import { UserCollections } from "../db/models/user.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { accessTokenLifetime, refreshTokenLifetime } from "../constant/user.js";
import { SessionCollection } from "../db/models/session.js";

const createSession = () => {
    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");
    const accessTokenValidUnit = new Date(Date.now() + accessTokenLifetime);
    const refreshTokenValidUnit = new Date(Date.now() + refreshTokenLifetime);
    return ({
        accessToken,
        refreshToken,
        accessTokenValidUnit,
        refreshTokenValidUnit
    });
};

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

    const sessionData = createSession();

    const userSession = await SessionCollection.create({
        userId: user._id,
        ...sessionData,
    });

    return userSession;
};

export const findAccessTokenBySession = accessToken => SessionCollection.findOne({ accessToken });

export const refreshSession = async({ refreshToken, sessionId }) => { 
    const oldSession = await SessionCollection.findOne({ _id: sessionId, refreshToken });

    if (!oldSession) {
        throw createHttpError(401, "Session not found");
    }

    if (new Date() > oldSession.refreshTokenValidUnit) {
    throw createHttpError(401, "Session token expired");
    }
    await SessionCollection.deleteOne({ _id: sessionId });
    const sessionData = createSession();
    const userSession = SessionCollection.create({
        userId: oldSession._id,
        ...sessionData
    });
    return userSession;
};

export const logout = async (sessionId) => await SessionCollection.deleteOne({_id: sessionId});

export const findUser = filter => UserCollections.findOne(filter);