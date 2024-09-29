// import { refreshTokenLifetime } from "../constant/user.js";
import { signUp, signIn, refreshSession, logout, requestResetToken, resetPassword } from "../services/auth.js";

const setupSession = (res, session) => { 
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expire: new Date(Date.now() + session.refreshTokenValidUnit)
    });
    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expire: new Date(Date.now() + session.refreshTokenValidUnit)
    });
};


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

    setupSession(res, session);

    res.json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const refreshController = async (req, res,) => {
    const { refreshToken, sessionId } = req.cookies;
    const session = await refreshSession({refreshToken, sessionId});
    setupSession(res, session);

     res.json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const logoutContoller = async (req, res) => { 
    const { sessionId } = req.cookies;
    if (sessionId) {
        await logout(sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
    res.json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {}
    }
    );
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};