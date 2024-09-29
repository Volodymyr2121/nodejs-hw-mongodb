import createHttpError from "http-errors";
import { UserCollections } from "../db/models/user.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { accessTokenLifetime, refreshTokenLifetime } from "../constant/user.js";
import { SessionCollection } from "../db/models/session.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { env } from "../utils/env.js";
import { SMTP, TEMPLATES_DIR } from "../constant/index.js";
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';


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
    const sessionData = createSession();
    const userSession = await SessionCollection.create({
        userId: oldSession.userId,
        ...sessionData
    });
    await SessionCollection.deleteOne({ _id: sessionId });
    return userSession;
};

export const logout = async (sessionId) => await SessionCollection.deleteOne({_id: sessionId});

export const findUser = filter => UserCollections.findOne(filter);

export const requestResetToken = async (email) => { 
    const user = await UserCollections.findOne({ email });
    if (!user) {
        throw createHttpError(404, "User not found");
    }

    const resetToken = jwt.sign({
        sub: user._id,
        email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
        },);
    
    const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
    
    try {
        await sendEmail({
            from: env(SMTP.SMTP_FROM),
            to: email,
            subject: 'Reset your password',
            html,
        });
    } catch(error) {
        throw createHttpError(500, "Failed to send the email, please try again later.");
    }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
} catch (error) {
    throw createHttpError(401, "Token is expired or invalid.");
}

  const user = await UserCollections.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollections.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
    );
    
    await SessionCollection.deleteOne({ userId: user._id });
};