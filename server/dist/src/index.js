"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const User_1 = require("./models/User");
const validateToken_1 = require("./validateToken");
const router = (0, express_1.Router)();
router.post("/register", (0, express_validator_1.body)("password").isLength({ min: 5 }).escape(), (0, express_validator_1.body)("CToken").escape(), (0, express_validator_1.body)("password").trim().escape(), (0, express_validator_1.body)("password").isLength({ min: 14 }), (0, express_validator_1.body)("password").custom(async (value) => {
    let characters = Array.from(value);
    let flagUpper = false;
    let flagLower = false;
    let flagNumber = false;
    let numberRegex = /^\d+$/;
    for (let i = 0; i < characters.length; i++) {
        let tester = characters[i].toUpperCase();
        let number = numberRegex.test(characters[i]);
        if (number) {
            continue;
        }
        if (characters[i] === tester) {
            flagUpper = true;
        }
    }
    for (let i = 0; i < characters.length; i++) {
        let tester = characters[i].toLowerCase();
        let number = numberRegex.test(characters[i]);
        if (number) {
            continue;
        }
        if (characters[i] === tester) {
            flagLower = true;
        }
    }
    characters.forEach((e) => {
        let number = numberRegex.test(e);
        if (number) {
            flagNumber = true;
        }
    });
    if (flagUpper == false || flagLower == false || flagNumber == false) {
        throw new Error('Password does not fullfill requirements.');
    }
}), (req, res, next) => {
    console.log("YYYYY");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(401).json({ errors: errors.array() });
        return;
    }
    next();
}, async (req, res) => {
    try {
        let success = false;
        let CToken = req.body.CToken;
        if (!CToken) {
            res.status(400).json({ message: "Captcha token missing" });
        }
        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${CToken}`, {});
        if (recaptchaResponse.ok) {
            success = true;
        }
        if (!success) {
            res.status(400).json({ message: "Captcha token invalid" });
        }
        const existingUser = await User_1.User.findOne({ username: req.body.username });
        console.log("hei" + existingUser);
        if (existingUser) {
            res.status(400).json({ message: "Username is already in use. Please choose another one." });
        }
        else {
            const salt = bcrypt_1.default.genSaltSync(10);
            const hash = bcrypt_1.default.hashSync(req.body.password, salt);
            const newUser = new User_1.User({
                username: req.body.username,
                password: hash,
            });
            await newUser.save();
            res.status(200).json({ message: "User registered successfully" });
        }
    }
    catch (error) {
        console.error(`Error during registration: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/login", (0, express_validator_1.body)("username").trim().escape(), (0, express_validator_1.body)("password").escape(), (0, express_validator_1.body)("CToken").escape(), (req, res, next) => {
    console.log("JEEJEE" + req.body.username);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
}, async (req, res) => {
    try {
        let success = false;
        let CToken = req.body.CToken;
        if (!CToken) {
            res.status(410).json({ message: "Captcha token missing" });
        }
        console.log("638HEREWEARE");
        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${CToken}`, {});
        if (recaptchaResponse.ok) {
            console.log("639HEREWEARE");
            success = true;
        }
        if (!success) {
            res.status(410).json({ message: "Captcha token invalid" });
        }
        const user = await User_1.User.findOne({ username: req.body.username });
        //console.log(user)
        if (!user) {
            console.log("2XXXXX" + req.body.username);
            res.status(401).json({ message: "Login failed" });
        }
        else {
            if (user.password && bcrypt_1.default.compareSync(req.body.password, user.password)) {
                const accessTokenjwtPayload = {
                    username: user.username.toLowerCase(),
                };
                const accessToken = jsonwebtoken_1.default.sign(accessTokenjwtPayload, process.env.ACCESSTOKENSECRET, { expiresIn: '5s' });
                const refreshTokenjwtPayload = {
                    username: user.username.toLowerCase(),
                };
                const refreshToken = jsonwebtoken_1.default.sign(refreshTokenjwtPayload, process.env.REFRESHTOKENSECRET, { expiresIn: '30d' });
                console.log("Tokens" + accessToken + "-XXX- " + refreshToken);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 30 * 1000
                });
                res.status(200).json({ success: true, token: accessToken });
            }
            else {
                res.status(403).json({ message: "Login failed" });
            }
        }
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post("/secret", validateToken_1.validateToken, async (req, res) => {
    try {
        res.status(200).json({ message: "Secret data accessed successfully" });
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get("/refreshtoken", async (req, res) => {
    try {
        let token = req.cookies.refreshToken;
        console.log("500 megaa" + token);
        if (!token) {
            res.status(401).json({ message: "Missing token" });
        }
        else {
            let verified = jsonwebtoken_1.default.verify(token, process.env.REFRESHTOKENSECRET);
            console.log("500" + verified + "||999||" + verified.username + "||999||");
            let user = await User_1.User.findOne({ username: verified.username });
            console.log("500" + verified);
            if (user) {
                const accessTokenjwtPayload = {
                    username: user.username.toLowerCase(),
                };
                const accessToken = jsonwebtoken_1.default.sign(accessTokenjwtPayload, process.env.ACCESSTOKENSECRET, { expiresIn: '15m' });
                console.log("500" + accessToken);
                res.status(201).json({ token: accessToken });
            }
            else {
                res.status(401).json({ message: "Error while fetching user from database." });
            }
        }
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(403).json({ message: "Token expired" });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.log('Invalid token!');
            res.status(402).json({ message: "Access denied invalid token." });
        }
        else {
            console.log(`Error ${error}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});
exports.default = router;
