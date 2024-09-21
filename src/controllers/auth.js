import { signUp, signIn } from "../services/auth.js";

export const authSignUpController = async (req, res, next) => {
    const newUser = await signUp(req.body);

    res.status(201).json({
        status: 201,
        message: `Succsessfully register user ${newUser.name}`,
        data: newUser,
    });
};

export const authSignInController = async (req, res, next) => { 
    const session = await signIn(req.body);

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expire: new Date(Date.now() + session.refreshTokenValidUnit)
    });
    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expire: new Date(Date.now() + session.refreshTokenValidUnit)
    });

    res.json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accesToken: session.accesToken,
        }
    });
};