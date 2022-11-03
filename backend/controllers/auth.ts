import passport from "passport";
import { Request, Response } from "express";

const successLoginUrl = "http://localhost:5000/protected";
const errorLoginUrl = "http://localhost:3000/auth/error";

const authUser = passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    accessType: "offline",
    prompt: "consent",
});

const callback = passport.authenticate("google", {
    successRedirect: successLoginUrl,
    failureRedirect: errorLoginUrl,
    failureMessage: "Cannot login to google. Some error occured.",
});

const getUser = (req: Request, res: Response) => {
    res.json(req.user);
};

const logout = (req: Request, res: Response) => {
    req.session.destroy(function (err) {
        console.log("czy jest error?", err);
    });
    res.redirect("/");
};

export default { authUser, callback, getUser, logout };
